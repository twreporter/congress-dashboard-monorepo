import keystoneFetch from '@/app/api/_graphql/keystone'

type Member = { id: string; email?: string; name?: string }

async function request<T>(query: string, variables: Record<string, unknown>) {
  const result = await keystoneFetch<T>(JSON.stringify({ query, variables }))
  if (result.errors?.length || !result.data) {
    const message =
      result.errors?.map((error) => error.message).join('; ') ||
      'No data returned'
    throw new Error(`Member sync failed: ${message}`)
  }
  return result.data
}

const MEMBER_QUERY = `
  query Member($where: MemberWhereUniqueInput!) {
    member(where: $where) { id email name }
  }
`

const CREATE_MEMBER = `
  mutation CreateMember($data: MemberCreateInput!) {
    createMember(data: $data) { id }
  }
`

const findMember = async (twreporterUserId: string) =>
  (
    await request<{ member?: Member }>(MEMBER_QUERY, {
      where: { twreporterUserId },
    })
  ).member

async function createMember(
  twreporterUserId: string,
  data: { email: string; name: string }
) {
  try {
    await request<{ createMember: Member }>(CREATE_MEMBER, {
      data: { twreporterUserId, ...data },
    })
    return undefined
  } catch (error) {
    // A simultaneous request may have created the member first.
    const member = await findMember(twreporterUserId)
    if (!member) throw error
    return member
  }
}

/**
 * Creates the member row when it is missing without touching an existing one,
 * so a request that only knows the identity from an access token never
 * overwrites the profile stored at login.
 */
export async function ensureMember(
  twreporterUserId: string,
  email: string,
  name: string
) {
  if (await findMember(twreporterUserId)) return
  await createMember(twreporterUserId, { email, name })
}

export async function upsertMember(
  twreporterUserId: string,
  email: string,
  name: string
) {
  const where = { twreporterUserId }
  const data = { email, name }

  const member =
    (await findMember(twreporterUserId)) ??
    (await createMember(twreporterUserId, data))
  if (!member) return

  if (member.email === email && member.name === name) {
    return
  }

  await request<{ updateMember: Member }>(
    `mutation UpdateMember($where: MemberWhereUniqueInput!, $data: MemberUpdateInput!) {
      updateMember(where: $where, data: $data) { id }
    }`,
    { where, data }
  )
}
