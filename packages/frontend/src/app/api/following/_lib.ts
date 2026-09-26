import type { NextRequest } from 'next/server'
import keystoneFetch from '@/app/api/_graphql/keystone'

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
    input: 'MemberFollowingLegislativeYuanMemberCreateInput',
    target: 'legislativeYuanMember',
    fields: 'id labelForCMS',
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

export function validId(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[1-9]\d*$/.test(value) &&
    Number.isSafeInteger(Number(value))
  )
}

export async function authenticatedUserId(request: NextRequest) {
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
  ) as { user_id?: number }
  if (!Number.isSafeInteger(claims.user_id) || (claims.user_id ?? 0) <= 0) {
    throw new Error('User ID is missing from access token')
  }
  return { userId: String(claims.user_id) }
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
  const query = `query Following($where: ${whereInput}!, $take: Int!, $skip: Int!) {
    ${list}(where: $where, orderBy: { createdAt: desc }, take: $take, skip: $skip) {
      id createdAt ${type.target} { ${type.fields} }
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
  targetId: string
) {
  const data = await cmsGraphQL<Record<string, FollowingRecord>>(
    `mutation AddFollowing($data: ${type.input}!) {
      ${type.create}(data: $data) { id createdAt ${type.target} { ${type.fields} } }
    }`,
    {
      data: {
        member: { connect: { twreporterUserId: userId } },
        [type.target]: { connect: { id: targetId } },
      },
    }
  )
  return data[type.create]
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
