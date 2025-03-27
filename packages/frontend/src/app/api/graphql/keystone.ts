import { getCookie } from '@/app/api/graphql/token'

export interface GraphQLResponse<T> {
  data?: T
  errors?: { message: string }[]
}
type Body = {
  query: string
  variables?: Record<string, string>
}

async function keystoneFetch<T>(
  query: string,
  variables?: Record<string, string>
): Promise<GraphQLResponse<T>> {
  const cookie = await getCookie()

  const rawBody: Body = { query }
  if (variables) {
    rawBody.variables = variables
  }
  const res = await fetch(process.env.API_SERVER_URL as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
    },
    body: JSON.stringify(rawBody),
  })

  if (!res.ok) {
    throw new Error(`Keystone API Error: ${res.statusText}`)
  }
  const data = await res.json()
  return data
}

export default keystoneFetch
