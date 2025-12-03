'use client'
import useSWR from 'swr'
// type
import type { Committee } from '@/types/committee'

type StateType<T> = {
  committees: T[]
  isLoading: boolean
  error?: Error
}

const fetchCommittee = async (url: string) => {
  const res = await fetch(url, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch committee`)
  }
  const data = await res.json()
  return data
}
const useCommittee = (): StateType<Committee> => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL as string
  const url = `${apiBase}/committee`
  const { data, isLoading, error } = useSWR(url, fetchCommittee)
  return {
    committees: data?.data || [],
    isLoading,
    error,
  }
}

export default useCommittee
