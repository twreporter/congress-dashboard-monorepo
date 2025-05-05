import { getCookie } from '@/app/api/graphql/token'

export interface GraphQLResponse<T> {
  data?: T
  errors?: { message: string }[]
}

// 處理 graphql null -> undefined
const transformNullToUndefined = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map(transformNullToUndefined) as T
  } else if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = (obj as Record<string, unknown>)[key]
        if (value !== null) {
          result[key] = transformNullToUndefined(value)
        }
      }
    }
    return result as T
  }
  return obj
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

  const raw = await res.json()
  const cleaned = transformNullToUndefined(raw)
  return cleaned
}

export default keystoneFetch
