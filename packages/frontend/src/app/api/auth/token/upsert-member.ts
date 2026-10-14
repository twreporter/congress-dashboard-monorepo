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

export async function upsertMember(
  twreporterUserId: string,
  email: string,
  name: string
) {
  const where = { twreporterUserId }
  const data = { email, name }
  const query = `
    query Member($where: MemberWhereUniqueInput!) {
      member(where: $where) { id email name }
    }
  `

  let { member } = await request<{ member?: Member }>(query, { where })
  if (!member) {
    try {
      await request<{ createMember: Member }>(
        `mutation CreateMember($data: MemberCreateInput!) {
          createMember(data: $data) { id }
        }`,
        { data: { twreporterUserId, ...data } }
      )
      return
    } catch (error) {
      // A simultaneous token exchange may have created the member first.
      member = (await request<{ member?: Member }>(query, { where })).member
      if (!member) throw error
    }
  }

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
