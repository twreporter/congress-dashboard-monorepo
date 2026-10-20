import type { NextRequest } from 'next/server'
import keystoneFetch from '@/app/api/_graphql/keystone'
import {
  MEMBER_SESSION_COOKIE,
  readMemberSession,
} from '@/app/api/_auth/member-session'
import { ensureMember } from '@/app/api/auth/token/upsert-member'

const followingTypes = {
  councilMember: {
    list: 'memberFollowingCouncilMembers',
    create: 'createMemberFollowingCouncilMember',
    delete: 'deleteMemberFollowingCouncilMember',
    input: 'MemberFollowingCouncilMemberCreateInput',
    target: 'councilMember',
    fields: 'id labelForCMS',
  },
  legislativeYuanMember: {
    list: 'memberFollowingLegislativeYuanMembers',
    create: 'createMemberFollowingLegislativeYuanMember',
    delete: 'deleteMemberFollowingLegislativeYuanMember',
    update: 'updateMemberFollowingLegislativeYuanMember',
    input: 'MemberFollowingLegislativeYuanMemberCreateInput',
    target: 'legislativeYuanMember',
    fields: 'id labelForCMS',
    sessions: true,
  },
  speech: {
    list: 'memberFollowingSpeeches',
    create: 'createMemberFollowingSpeech',
    delete: 'deleteMemberFollowingSpeech',
    input: 'MemberFollowingSpeechCreateInput',
    target: 'speech',
    fields: 'id title slug',
  },
  councilSpeech: {
    list: 'memberFollowingCouncilSpeeches',
    create: 'createMemberFollowingCouncilSpeech',
    delete: 'deleteMemberFollowingCouncilSpeech',
    input: 'MemberFollowingCouncilSpeechCreateInput',
    target: 'councilSpeech',
    fields: 'id title slug',
  },
  councilBill: {
    list: 'memberFollowingCouncilBills',
    create: 'createMemberFollowingCouncilBill',
    delete: 'deleteMemberFollowingCouncilBill',
    input: 'MemberFollowingCouncilBillCreateInput',
    target: 'councilBill',
    fields: 'id title slug',
  },
} as const

export type FollowingType = (typeof followingTypes)[keyof typeof followingTypes]

export function getFollowingType(type: string): FollowingType | undefined {
  return Object.prototype.hasOwnProperty.call(followingTypes, type)
    ? followingTypes[type as keyof typeof followingTypes]
    : undefined
}

export const hasSessions = (
  type: FollowingType
): type is FollowingType & { sessions: true; update: string } =>
  'sessions' in type && type.sessions === true

export type SessionScope =
  | { allSessions: true }
  | { allSessions: false; sessionIds: string[] }

/**
 * Omitting sessionTerms means "all sessions". That is stored as a flag rather
 * than an enumerated list so sessions added later stay covered.
 */
export function parseSessionTerms(
  value: unknown
): { error: string } | { terms?: number[] } {
  if (value === undefined || value === null) return {}
  if (!Array.isArray(value) || value.length === 0) {
    return { error: 'sessionTerms must be a non-empty array, or omitted' }
  }
  const terms = [...new Set(value.map(Number))]
  if (terms.some((term) => !Number.isSafeInteger(term) || term < 1)) {
    return { error: 'Invalid sessionTerms' }
  }
  return { terms }
}

/**
 * Resolves session terms inside one meeting, which also prevents attaching a
 * session from a different term to the follow.
 */
export async function resolveSessionScope(
  meetingWhere: Record<string, unknown>,
  terms?: number[]
): Promise<{ error: string } | SessionScope> {
  if (!terms) return { allSessions: true }

  const data = await cmsGraphQL<{
    legislativeMeetingSessions?: { id: string; term: number }[]
  }>(
    `query Sessions($where: LegislativeMeetingSessionWhereInput!) {
      legislativeMeetingSessions(where: $where) { id term }
    }`,
    { where: { legislativeMeeting: meetingWhere, term: { in: terms } } }
  )
  const found = data.legislativeMeetingSessions ?? []
  if (found.length !== terms.length) {
    return { error: 'Some sessionTerms do not belong to this meeting' }
  }
  return { allSessions: false, sessionIds: found.map(({ id }) => id) }
}

export const sessionCreateData = (scope: SessionScope) =>
  scope.allSessions
    ? { allSessions: true }
    : {
        allSessions: false,
        sessions: { connect: scope.sessionIds.map((id) => ({ id })) },
      }

export const sessionUpdateData = (scope: SessionScope) =>
  scope.allSessions
    ? { allSessions: true, sessions: { set: [] } }
    : {
        allSessions: false,
        sessions: { set: scope.sessionIds.map((id) => ({ id })) },
      }

/** The meeting a LegislativeYuanMember belongs to, used to scope its sessions. */
export async function meetingOfLegislativeYuanMember(targetId: string) {
  const data = await cmsGraphQL<{
    legislativeYuanMember?: { legislativeMeeting?: { id: string } }
  }>(
    `query TargetMeeting($id: ID!) {
      legislativeYuanMember(where: { id: $id }) { legislativeMeeting { id } }
    }`,
    { id: targetId }
  )
  const meetingId = data.legislativeYuanMember?.legislativeMeeting?.id
  return meetingId ? { id: { equals: meetingId } } : undefined
}

/**
 * `skip` is sent to the CMS as a GraphQL `Int`, so anything above the signed
 * 32-bit range is rejected here instead of failing inside the CMS.
 */
const MAX_GRAPHQL_INT = 2_147_483_647

export function parsePagination(
  searchParams: URLSearchParams
): { error: string } | { take: number; skip: number } {
  const take = searchParams.get('take') ?? '50'
  const skip = searchParams.get('skip') ?? '0'
  if (
    !/^\d+$/.test(take) ||
    !/^\d+$/.test(skip) ||
    Number(take) < 1 ||
    Number(take) > 100 ||
    Number(skip) > MAX_GRAPHQL_INT
  ) {
    return { error: 'Invalid pagination' }
  }
  return { take: Number(take), skip: Number(skip) }
}

export function validId(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[1-9]\d*$/.test(value) &&
    Number.isSafeInteger(Number(value))
  )
}

export async function authenticatedUserId(request: NextRequest) {
  // The session issued at login is the primary credential for member
  // features; the TWReporter token is only consulted for browsers that still
  // hold a valid login from before the session existed.
  const sessionUserId = readMemberSession(
    request.cookies.get(MEMBER_SESSION_COOKIE)?.value
  )
  if (sessionUserId) return { userId: sessionUserId }

  const idToken = request.cookies.get('id_token')?.value
  if (!idToken) return {}

  const url =
    process.env.NEXT_PUBLIC_TWREPORTER_API_URL ||
    'https://staging-go-api.twreporter.org'
  const response = await fetch(`${url}/v2/auth/token`, {
    method: 'POST',
    headers: {
      Cookie: `id_token=${encodeURIComponent(idToken)}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
  if (response.status === 400 || response.status === 401) return {}
  if (!response.ok) throw new Error('Authentication service unavailable')

  const payload = await response.json()
  const token = payload?.data?.jwt
  if (typeof token !== 'string') throw new Error('Access token is missing')

  // Only decode the token returned by this trusted server-to-server exchange,
  // never a token supplied by the browser.
  const claims = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64url').toString('utf8')
  ) as { user_id?: number; email?: string }
  if (!Number.isSafeInteger(claims.user_id) || (claims.user_id ?? 0) <= 0) {
    throw new Error('User ID is missing from access token')
  }
  if (!claims.email) throw new Error('Email is missing from access token')

  const userId = String(claims.user_id)
  // The follow below connects to a member row, which this request may be the
  // first one to need.
  await ensureMember(userId, claims.email, claims.email.split('@')[0])
  return { userId }
}

type FollowingRecord = {
  id: string
  createdAt?: string
  [key: string]: unknown
}

export async function cmsGraphQL<T>(
  query: string,
  variables: Record<string, unknown>
) {
  const result = await keystoneFetch<T>(JSON.stringify({ query, variables }))
  if (result.errors?.length || !result.data) {
    throw new Error(
      result.errors?.map((error) => error.message).join('; ') ||
        'Empty CMS response'
    )
  }
  return result.data
}

export async function listFollowing(
  type: FollowingType,
  userId: string,
  {
    targetId,
    take = 50,
    skip = 0,
  }: { targetId?: string; take?: number; skip?: number } = {}
) {
  const where = {
    member: { twreporterUserId: { equals: userId } },
    ...(targetId ? { [type.target]: { id: { equals: targetId } } } : {}),
  }
  const whereInput = type.input.replace('CreateInput', 'WhereInput')
  const list = type.list
  const scope = hasSessions(type) ? 'allSessions sessions { id term }' : ''
  const query = `query Following($where: ${whereInput}!, $take: Int!, $skip: Int!) {
    ${list}(where: $where, orderBy: { createdAt: desc }, take: $take, skip: $skip) {
      id createdAt ${scope} ${type.target} { ${type.fields} }
    }
  }`
  const data = await cmsGraphQL<Record<string, FollowingRecord[]>>(query, {
    where,
    take: targetId ? 1 : take,
    skip,
  })
  return data[type.list]
}

export async function createFollowing(
  type: FollowingType,
  userId: string,
  targetId: string,
  scope?: SessionScope
) {
  const fields = hasSessions(type) ? 'allSessions sessions { id term }' : ''
  const data = await cmsGraphQL<Record<string, FollowingRecord>>(
    `mutation AddFollowing($data: ${type.input}!) {
      ${type.create}(data: $data) { id createdAt ${fields} ${type.target} { ${type.fields} } }
    }`,
    {
      data: {
        member: { connect: { twreporterUserId: userId } },
        [type.target]: { connect: { id: targetId } },
        ...(scope ? sessionCreateData(scope) : {}),
      },
    }
  )
  return data[type.create]
}

/**
 * Re-following an item only adjusts its session scope; the row keeps the time
 * the member first followed it.
 */
export async function updateFollowingScope(
  type: FollowingType & { sessions: true; update: string },
  followingId: string,
  scope: SessionScope
) {
  const prefix = type.input.replace('CreateInput', '')
  const data = await cmsGraphQL<Record<string, FollowingRecord>>(
    `mutation UpdateFollowing($where: ${prefix}WhereUniqueInput!, $data: ${prefix}UpdateInput!) {
      ${type.update}(where: $where, data: $data) {
        id createdAt allSessions sessions { id term } ${type.target} { ${type.fields} }
      }
    }`,
    { where: { id: followingId }, data: sessionUpdateData(scope) }
  )
  return data[type.update]
}

export async function deleteFollowing(
  type: FollowingType,
  followingId: string
) {
  const whereInput = type.input.replace('CreateInput', 'WhereUniqueInput')
  const data = await cmsGraphQL<Record<string, { id: string }>>(
    `mutation RemoveFollowing($where: ${whereInput}!) {
      ${type.delete}(where: $where) { id }
    }`,
    { where: { id: followingId } }
  )
  return data[type.delete]
}
