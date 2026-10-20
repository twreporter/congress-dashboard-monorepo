import {
  authenticatedUserId,
  cmsGraphQL,
  sessionCreateData,
  sessionUpdateData,
  type SessionScope,
} from './_lib'

type SlugField = { param: string; relation: string }

/**
 * Context handed to a following type's own validation, after its slugs and the
 * meeting it belongs to have been parsed.
 */
type ValidateContext = {
  slugs: Record<string, string>
  meetingTerm?: number
  city?: string
  councilMeetingId?: string
}

type ComboDefinition = {
  prefix: string
  list: string
  create: string
  update: string
  delete: string
  selection: string
  // Which institution the follow belongs to. Legislative follows carry a
  // session scope; council follows are scoped to one meeting term.
  meeting: 'legislative' | 'council'
  slugFields: readonly SlugField[]
  sources?: readonly string[]
  validate: (context: ValidateContext) => Promise<boolean>
}

const speechesExist = async (where: Record<string, unknown>) => {
  const data = await cmsGraphQL<{ speechesCount?: number }>(
    `query ValidateFollowing($where: SpeechWhereInput!) {
      speechesCount(where: $where)
    }`,
    { where }
  )
  return (data.speechesCount ?? 0) > 0
}

// A council topic is reached through either a speech or a bill.
const councilRecordsExist = async (where: Record<string, unknown>) => {
  const data = await cmsGraphQL<{
    councilSpeechesCount?: number
    councilBillsCount?: number
  }>(
    `query ValidateFollowing($where: CouncilSpeechWhereInput!, $billWhere: CouncilBillWhereInput!) {
      councilSpeechesCount(where: $where)
      councilBillsCount(where: $billWhere)
    }`,
    { where, billWhere: where }
  )
  return (data.councilSpeechesCount ?? 0) + (data.councilBillsCount ?? 0) > 0
}

const combos = {
  topicLegislator: {
    prefix: 'MemberFollowingTopicLegislator',
    list: 'memberFollowingTopicLegislators',
    create: 'createMemberFollowingTopicLegislator',
    update: 'updateMemberFollowingTopicLegislator',
    delete: 'deleteMemberFollowingTopicLegislator',
    selection:
      'source allSessions sessions { id term } topic { id title slug } legislator { id name slug } legislativeMeeting { id term }',
    meeting: 'legislative',
    slugFields: [
      { param: 'topicSlug', relation: 'topic' },
      { param: 'legislatorSlug', relation: 'legislator' },
    ],
    sources: ['topic', 'legislator'],
    // Topic and Legislator have no direct relation, so the pair is only
    // meaningful when the legislator spoke on that topic in that term.
    validate: ({ slugs, meetingTerm }) =>
      speechesExist({
        topics: { some: { slug: { equals: slugs.topicSlug } } },
        legislativeYuanMember: {
          legislator: { slug: { equals: slugs.legislatorSlug } },
        },
        legislativeMeeting: { term: { equals: meetingTerm } },
      }),
  },
  councilTopicCouncilor: {
    prefix: 'MemberFollowingCouncilTopicCouncilor',
    list: 'memberFollowingCouncilTopicCouncilors',
    create: 'createMemberFollowingCouncilTopicCouncilor',
    update: 'updateMemberFollowingCouncilTopicCouncilor',
    delete: 'deleteMemberFollowingCouncilTopicCouncilor',
    selection:
      'source councilTopic { id title slug } councilor { id name slug } councilMeeting { id city term }',
    meeting: 'council',
    slugFields: [
      { param: 'councilTopicSlug', relation: 'councilTopic' },
      { param: 'councilorSlug', relation: 'councilor' },
    ],
    sources: ['topic', 'councilor'],
    validate: ({ slugs, councilMeetingId }) =>
      councilRecordsExist({
        topic: { some: { slug: { equals: slugs.councilTopicSlug } } },
        councilMember: {
          some: { councilor: { slug: { equals: slugs.councilorSlug } } },
        },
        councilMeeting: { id: { equals: councilMeetingId } },
      }),
  },
  topic: {
    prefix: 'MemberFollowingTopic',
    list: 'memberFollowingTopics',
    create: 'createMemberFollowingTopic',
    update: 'updateMemberFollowingTopic',
    delete: 'deleteMemberFollowingTopic',
    selection:
      'allSessions sessions { id term } topic { id title slug } legislativeMeeting { id term }',
    meeting: 'legislative',
    slugFields: [{ param: 'topicSlug', relation: 'topic' }],
    validate: ({ slugs, meetingTerm }) =>
      speechesExist({
        topics: { some: { slug: { equals: slugs.topicSlug } } },
        legislativeMeeting: { term: { equals: meetingTerm } },
      }),
  },
  councilTopic: {
    prefix: 'MemberFollowingCouncilTopic',
    list: 'memberFollowingCouncilTopics',
    create: 'createMemberFollowingCouncilTopic',
    update: 'updateMemberFollowingCouncilTopic',
    delete: 'deleteMemberFollowingCouncilTopic',
    selection: 'councilTopic { id title slug } councilMeeting { id city term }',
    meeting: 'council',
    slugFields: [{ param: 'councilTopicSlug', relation: 'councilTopic' }],
    validate: ({ slugs, councilMeetingId }) =>
      councilRecordsExist({
        topic: { some: { slug: { equals: slugs.councilTopicSlug } } },
        councilMeeting: { id: { equals: councilMeetingId } },
      }),
  },
} as const satisfies Record<string, ComboDefinition>

export type Combo = (typeof combos)[keyof typeof combos]

export function getCombo(name: string): Combo | undefined {
  return Object.prototype.hasOwnProperty.call(combos, name)
    ? combos[name as keyof typeof combos]
    : undefined
}

/** Only legislative follows can be narrowed down to single sessions. */
export const hasSessionScope = (combo: Combo) => combo.meeting === 'legislative'

/**
 * The council meeting term is optional. A lookup without it matches whichever
 * term the follow was saved with, so a follow made in an earlier term stays
 * addressable once a new term begins.
 */
export function comboKeyParams(combo: Combo) {
  const slugs = combo.slugFields.map(({ param }) => param)
  return hasSessionScope(combo)
    ? { required: [...slugs, 'meetingTerm'], optional: [] as string[] }
    : { required: [...slugs, 'city'], optional: ['meetingTerm'] }
}

const isSlug = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-z0-9-]{1,191}$/.test(value)

const readParam = (input: Record<string, unknown>, key: string) => input[key]

const parseTerm = (value: unknown) => {
  const term = Number(value)
  return Number.isSafeInteger(term) && term >= 1 ? term : undefined
}

export type ComboWhere = { where: Record<string, unknown> }

export type ComboKey = ComboWhere & { connect: Record<string, unknown> }

type ParsedInput =
  | { error: string }
  | { slugs: Record<string, string>; meetingTerm?: number; city?: string }

function parseComboInput(
  combo: Combo,
  input: Record<string, unknown>
): ParsedInput {
  const slugs: Record<string, string> = {}
  for (const { param } of combo.slugFields) {
    const value = readParam(input, param)
    if (!isSlug(value)) return { error: `Invalid ${param}` }
    slugs[param] = value
  }

  const rawTerm = readParam(input, 'meetingTerm')
  if (hasSessionScope(combo)) {
    const meetingTerm = parseTerm(rawTerm)
    if (meetingTerm === undefined) return { error: 'Invalid meetingTerm' }
    return { slugs, meetingTerm }
  }

  const city = readParam(input, 'city')
  if (!isSlug(city)) return { error: 'Invalid city' }
  if (rawTerm === undefined || rawTerm === null || rawTerm === '') {
    return { slugs, city }
  }
  const meetingTerm = parseTerm(rawTerm)
  if (meetingTerm === undefined) return { error: 'Invalid meetingTerm' }
  return { slugs, city, meetingTerm }
}

const slugWhere = (combo: Combo, slugs: Record<string, string>) =>
  Object.fromEntries(
    combo.slugFields.map(({ param, relation }) => [
      relation,
      { slug: { equals: slugs[param] } },
    ])
  )

const slugConnect = (combo: Combo, slugs: Record<string, string>) =>
  Object.fromEntries(
    combo.slugFields.map(({ param, relation }) => [
      relation,
      { connect: { slug: slugs[param] } },
    ])
  )

/**
 * Builds the identity a stored follow is looked up and deleted by. Without a
 * council meeting term it matches every term of that city, so the term the
 * follow was saved with no longer has to be guessed.
 */
export function resolveComboLookupKey(
  combo: Combo,
  input: Record<string, unknown>
): { error: string } | ComboWhere {
  const parsed = parseComboInput(combo, input)
  if ('error' in parsed) return parsed

  if (hasSessionScope(combo)) {
    return {
      where: {
        ...slugWhere(combo, parsed.slugs),
        legislativeMeeting: { term: { equals: parsed.meetingTerm } },
      },
    }
  }
  return {
    where: {
      ...slugWhere(combo, parsed.slugs),
      councilMeeting: {
        city: { equals: parsed.city },
        ...(parsed.meetingTerm === undefined
          ? {}
          : { term: { equals: parsed.meetingTerm } }),
      },
    },
  }
}

// Council pages render the latest term unless the caller names one, so the
// meeting is resolved here and kept as the term snapshot of the follow.
async function councilMeetingId(city: string, term?: number) {
  const data = await cmsGraphQL<{ councilMeetings?: { id: string }[] }>(
    `query CouncilMeeting($where: CouncilMeetingWhereInput!) {
      councilMeetings(where: $where, orderBy: { term: desc }, take: 1) { id }
    }`,
    {
      where: {
        city: { equals: city },
        ...(term === undefined ? {} : { term: { equals: term } }),
      },
    }
  )
  return data.councilMeetings?.[0]?.id
}

type CreateKeyResult =
  | { error: string }
  | {
      key: ComboKey
      validate: () => Promise<boolean>
      // Present for legislative follows, used to scope session terms.
      meetingWhere?: Record<string, unknown>
    }

/** Builds the identity a new follow is created with. */
export async function resolveComboCreateKey(
  combo: Combo,
  input: Record<string, unknown>
): Promise<CreateKeyResult> {
  const parsed = parseComboInput(combo, input)
  if ('error' in parsed) return parsed

  if (hasSessionScope(combo)) {
    const { slugs, meetingTerm } = parsed
    return {
      key: {
        where: {
          ...slugWhere(combo, slugs),
          legislativeMeeting: { term: { equals: meetingTerm } },
        },
        connect: {
          ...slugConnect(combo, slugs),
          legislativeMeeting: { connect: { term: meetingTerm } },
        },
      },
      meetingWhere: { term: { equals: meetingTerm } },
      validate: () => combo.validate({ slugs, meetingTerm }),
    }
  }

  const { slugs, city, meetingTerm } = parsed as {
    slugs: Record<string, string>
    city: string
    meetingTerm?: number
  }
  const meetingId = await councilMeetingId(city, meetingTerm)
  if (!meetingId) return { error: 'No council meeting for city' }

  return {
    key: {
      where: {
        ...slugWhere(combo, slugs),
        councilMeeting: { id: { equals: meetingId } },
      },
      connect: {
        ...slugConnect(combo, slugs),
        councilMeeting: { connect: { id: meetingId } },
      },
    },
    validate: () =>
      combo.validate({ slugs, city, councilMeetingId: meetingId }),
  }
}

const comboSources = (combo: Combo): readonly string[] | undefined =>
  'sources' in combo ? combo.sources : undefined

export function validSource(combo: Combo, value: unknown) {
  const sources = comboSources(combo) ?? []
  return (
    value === undefined ||
    (typeof value === 'string' && sources.includes(value))
  )
}

/** Follows that do not start from a specific page carry no source. */
export const defaultSource = (combo: Combo, value: unknown) => {
  const sources = comboSources(combo)
  return sources ? (value as string | undefined) ?? sources[0] : undefined
}

type ComboFollowing = { id: string; [key: string]: unknown }

export async function listComboFollowing(
  combo: Combo,
  userId: string,
  {
    key,
    take = 50,
    skip = 0,
  }: { key?: ComboWhere; take?: number; skip?: number }
) {
  const data = await cmsGraphQL<Record<string, ComboFollowing[]>>(
    `query ComboFollowing($where: ${combo.prefix}WhereInput!, $take: Int!, $skip: Int!) {
      ${combo.list}(where: $where, orderBy: { createdAt: desc }, take: $take, skip: $skip) {
        id createdAt ${combo.selection}
      }
    }`,
    {
      where: {
        member: { twreporterUserId: { equals: userId } },
        ...(key?.where ?? {}),
      },
      take: key ? 1 : take,
      skip: key ? 0 : skip,
    }
  )
  return data[combo.list]
}

export async function createComboFollowing(
  combo: Combo,
  userId: string,
  key: ComboKey,
  source: string | undefined,
  scope?: SessionScope
) {
  const data = await cmsGraphQL<Record<string, ComboFollowing>>(
    `mutation AddComboFollowing($data: ${combo.prefix}CreateInput!) {
      ${combo.create}(data: $data) { id createdAt ${combo.selection} }
    }`,
    {
      data: {
        member: { connect: { twreporterUserId: userId } },
        ...key.connect,
        ...(source ? { source } : {}),
        ...(scope ? sessionCreateData(scope) : {}),
      },
    }
  )
  return data[combo.create]
}

/**
 * Following the same pair again only adjusts its session scope, so the row
 * keeps the time the member first followed it.
 */
export async function updateComboScope(
  combo: Combo,
  followingId: string,
  scope: SessionScope
) {
  const data = await cmsGraphQL<Record<string, ComboFollowing>>(
    `mutation UpdateComboFollowing($where: ${combo.prefix}WhereUniqueInput!, $data: ${combo.prefix}UpdateInput!) {
      ${combo.update}(where: $where, data: $data) {
        id createdAt ${combo.selection}
      }
    }`,
    { where: { id: followingId }, data: sessionUpdateData(scope) }
  )
  return data[combo.update]
}

export async function deleteComboFollowing(combo: Combo, followingId: string) {
  return cmsGraphQL<Record<string, { id: string }>>(
    `mutation RemoveComboFollowing($where: ${combo.prefix}WhereUniqueInput!) {
      ${combo.delete}(where: $where) { id }
    }`,
    { where: { id: followingId } }
  )
}

export { authenticatedUserId }
