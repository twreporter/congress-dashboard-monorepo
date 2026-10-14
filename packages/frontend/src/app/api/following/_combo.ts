import {
  authenticatedUserId,
  cmsGraphQL,
  sessionCreateData,
  sessionUpdateData,
  type SessionScope,
} from './_lib'

const combos = {
  topicLegislator: {
    prefix: 'MemberFollowingTopicLegislator',
    list: 'memberFollowingTopicLegislators',
    create: 'createMemberFollowingTopicLegislator',
    update: 'updateMemberFollowingTopicLegislator',
    delete: 'deleteMemberFollowingTopicLegislator',
    selection:
      'allSessions sessions { id term } topic { id title slug } legislator { id name slug } legislativeMeeting { id term }',
    sources: ['topic', 'legislator'],
  },
  councilTopicCouncilor: {
    prefix: 'MemberFollowingCouncilTopicCouncilor',
    list: 'memberFollowingCouncilTopicCouncilors',
    create: 'createMemberFollowingCouncilTopicCouncilor',
    update: 'updateMemberFollowingCouncilTopicCouncilor',
    delete: 'deleteMemberFollowingCouncilTopicCouncilor',
    selection:
      'councilTopic { id title slug } councilor { id name slug } councilMeeting { id city term }',
    sources: ['topic', 'councilor'],
  },
} as const

export type Combo = (typeof combos)[keyof typeof combos]

export function getCombo(name: string): Combo | undefined {
  return Object.prototype.hasOwnProperty.call(combos, name)
    ? combos[name as keyof typeof combos]
    : undefined
}

export function isTopicLegislator(combo: Combo) {
  return combo.prefix === 'MemberFollowingTopicLegislator'
}

const isSlug = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-z0-9-]{1,191}$/.test(value)

const readParam = (input: Record<string, unknown>, key: string) => input[key]

export type ComboKey = {
  where: Record<string, unknown>
  connect: Record<string, unknown>
}

type KeyResult =
  | { error: string }
  | {
      key: ComboKey
      validate: () => Promise<boolean>
      // Present for legislative combos, used to scope session terms.
      meetingWhere?: Record<string, unknown>
    }

/**
 * Builds the pair identity from request input. Slugs are resolved to the
 * meeting the member was viewing so the record keeps that term snapshot.
 */
export async function resolveComboKey(
  combo: Combo,
  input: Record<string, unknown>
): Promise<KeyResult> {
  if (isTopicLegislator(combo)) {
    const topicSlug = readParam(input, 'topicSlug')
    const legislatorSlug = readParam(input, 'legislatorSlug')
    const rawTerm = readParam(input, 'meetingTerm')
    const meetingTerm = Number(rawTerm)

    if (!isSlug(topicSlug) || !isSlug(legislatorSlug)) {
      return { error: 'Invalid topicSlug or legislatorSlug' }
    }
    if (!Number.isSafeInteger(meetingTerm) || meetingTerm < 1) {
      return { error: 'Invalid meetingTerm' }
    }

    return {
      key: {
        where: {
          topic: { slug: { equals: topicSlug } },
          legislator: { slug: { equals: legislatorSlug } },
          legislativeMeeting: { term: { equals: meetingTerm } },
        },
        connect: {
          topic: { connect: { slug: topicSlug } },
          legislator: { connect: { slug: legislatorSlug } },
          legislativeMeeting: { connect: { term: meetingTerm } },
        },
      },
      meetingWhere: { term: { equals: meetingTerm } },
      // Topic and Legislator have no direct relation, so the pair is only
      // meaningful when the legislator spoke on that topic in that term.
      validate: async () => {
        const data = await cmsGraphQL<{ speechesCount?: number }>(
          `query ValidatePair($where: SpeechWhereInput!) {
            speechesCount(where: $where)
          }`,
          {
            where: {
              topics: { some: { slug: { equals: topicSlug } } },
              legislativeYuanMember: {
                legislator: { slug: { equals: legislatorSlug } },
              },
              legislativeMeeting: { term: { equals: meetingTerm } },
            },
          }
        )
        return (data.speechesCount ?? 0) > 0
      },
    }
  }

  const councilTopicSlug = readParam(input, 'councilTopicSlug')
  const councilorSlug = readParam(input, 'councilorSlug')
  const city = readParam(input, 'city')

  if (!isSlug(councilTopicSlug) || !isSlug(councilorSlug)) {
    return { error: 'Invalid councilTopicSlug or councilorSlug' }
  }
  if (!isSlug(city)) return { error: 'Invalid city' }

  // Council pages always render the latest term for the city, so the snapshot
  // is resolved here instead of being supplied by the browser.
  const meetings = await cmsGraphQL<{
    councilMeetings?: { id: string }[]
  }>(
    `query LatestMeeting($city: String!) {
      councilMeetings(
        where: { city: { equals: $city } }
        orderBy: { term: desc }
        take: 1
      ) { id }
    }`,
    { city }
  )
  const councilMeetingId = meetings.councilMeetings?.[0]?.id
  if (!councilMeetingId) return { error: 'No council meeting for city' }

  return {
    key: {
      where: {
        councilTopic: { slug: { equals: councilTopicSlug } },
        councilor: { slug: { equals: councilorSlug } },
        councilMeeting: { id: { equals: councilMeetingId } },
      },
      connect: {
        councilTopic: { connect: { slug: councilTopicSlug } },
        councilor: { connect: { slug: councilorSlug } },
        councilMeeting: { connect: { id: councilMeetingId } },
      },
    },
    // A councilor may relate to a topic through either a speech or a bill.
    validate: async () => {
      const where = {
        topic: { some: { slug: { equals: councilTopicSlug } } },
        councilMember: {
          some: { councilor: { slug: { equals: councilorSlug } } },
        },
        councilMeeting: { id: { equals: councilMeetingId } },
      }
      const data = await cmsGraphQL<{
        councilSpeechesCount?: number
        councilBillsCount?: number
      }>(
        `query ValidatePair($where: CouncilSpeechWhereInput!, $billWhere: CouncilBillWhereInput!) {
          councilSpeechesCount(where: $where)
          councilBillsCount(where: $billWhere)
        }`,
        { where, billWhere: where }
      )
      return (
        (data.councilSpeechesCount ?? 0) + (data.councilBillsCount ?? 0) > 0
      )
    },
  }
}

export function validSource(combo: Combo, value: unknown) {
  return (
    value === undefined ||
    (typeof value === 'string' &&
      (combo.sources as readonly string[]).includes(value))
  )
}

type ComboFollowing = { id: string; [key: string]: unknown }

export async function listComboFollowing(
  combo: Combo,
  userId: string,
  { key, take = 50, skip = 0 }: { key?: ComboKey; take?: number; skip?: number }
) {
  const data = await cmsGraphQL<Record<string, ComboFollowing[]>>(
    `query ComboFollowing($where: ${combo.prefix}WhereInput!, $take: Int!, $skip: Int!) {
      ${combo.list}(where: $where, orderBy: { createdAt: desc }, take: $take, skip: $skip) {
        id createdAt source ${combo.selection}
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
  source: string,
  scope?: SessionScope
) {
  const data = await cmsGraphQL<Record<string, ComboFollowing>>(
    `mutation AddComboFollowing($data: ${combo.prefix}CreateInput!) {
      ${combo.create}(data: $data) { id createdAt source ${combo.selection} }
    }`,
    {
      data: {
        member: { connect: { twreporterUserId: userId } },
        ...key.connect,
        source,
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
        id createdAt source ${combo.selection}
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
