'use client'
import useSWR from 'swr'

export type partyData = {
  id: number
  slug: string
  name: string
  imageLink?: string
  image?: { imageFile: { url: string } }
}
export type stateType<T> = {
  party: T[]
  isLoading: boolean
  error?: Error
}

const fetchParty = async (url: string) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query Query {
          parties {
            slug
            name
            imageLink
            image {
              imageFile {
                url
              }
            }
          }
        }
      `,
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch party`)
  }
  const data = await res.json()
  return data
}
const useParty = () => {
  const url = process.env.NEXT_PUBLIC_API_URL as string
  const { data, isLoading, error } = useSWR(url, fetchParty)
  return {
    party: data?.data?.parties || [],
    isLoading,
    error,
  }
}

export default useParty
