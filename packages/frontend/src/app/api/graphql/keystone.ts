import { getCookie } from '@/app/api/graphql/token'

export interface GraphQLResponse<T> {
  data?: T
  errors?: { message: string }[]
}

// 處理 graphql null -> undefined
const transformNullToUndefined = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    // 對於陣列，遞迴映射每個元素
    return obj.map(transformNullToUndefined) as T
  } else if (obj !== null && typeof obj === 'object') {
    // 對於非 null 物件
    const result: Record<string, unknown> = {}
    for (const key in obj) {
      // 只處理物件自身的屬性
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = (obj as Record<string, unknown>)[key]
        // 如果值不是 null，遞迴處理並加入結果
        if (value !== null) {
          result[key] = transformNullToUndefined(value)
        }
        // 如果值是 null，則忽略，使其在結果中為 undefined
      }
    }
    return result as T
  }
  // 對於非陣列、非物件或 null 的值，直接返回
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
