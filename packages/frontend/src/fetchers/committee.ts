import useSWR from 'swr'

export type committeeData = {
  slug: string
  name: string
  type: 'standing' | 'ad-hoc'
}
export type stateType<T> = {
  committees: T[]
  isLoading: boolean
  error?: Error
}

const fetchCommittee = async (url: string) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query Committees {
          committees {
            name
            slug
            type
          }
        }
      `,
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch committee`)
  }
  const data = await res.json()
  return data
}
const useCommittee = () => {
  const url = process.env.NEXT_PUBLIC_API_URL as string
  const { data, isLoading, error } = useSWR(url, fetchCommittee)
  return {
    committees: data?.data?.committees || [],
    isLoading,
    error,
  }
}

export default useCommittee
