import { getCookie } from '@/app/api/graphql/token'

export interface GraphQLResponse<T> {
  data?: T
  errors?: { message: string }[]
}

export async function keystoneFetch<T>(
  bodyString: string,
  keepAlive = true
): Promise<GraphQLResponse<T>> {
  if (!bodyString) {
    throw new Error(`body string cannot be empty`)
  }

  const cookie = await getCookie()
  const res = await fetch(process.env.API_SERVER_URL as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
      Connection: keepAlive ? 'keep-alive' : 'close',
    },
    body: bodyString,
  })

  if (!res.ok) {
    throw new Error(`Keystone API Error: ${res.statusText}`)
  }
  const data = await res.json()
  return data
}

export default keystoneFetch
