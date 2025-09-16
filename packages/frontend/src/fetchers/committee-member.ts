'use client'
import useSWR from 'swr'

type CommitteeForReturn = {
  count: number
  name: string
}
type StateType<T> = {
  committees: T[]
  isLoading: boolean
  error?: Error
}
type FetchCommitteeMemberParams = {
  slug: string
  legislativeMeetingId: number
}

const fetchCommitteeMember = async ({
  slug,
  legislativeMeetingId,
}: FetchCommitteeMemberParams) => {
  if (!slug || !legislativeMeetingId) {
    return
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL as string
  const url = `${apiBase}/committee-member/${encodeURIComponent(
    slug
  )}?mid=${encodeURIComponent(legislativeMeetingId)}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch committee member. slug: ${slug}, meeting id: ${legislativeMeetingId}`
    )
  }
  const data = await res.json()
  return data
}
const useCommitteeMember = (
  params?: FetchCommitteeMemberParams
): StateType<CommitteeForReturn> => {
  const { data, isLoading, error } = useSWR(
    params ? params : null,
    fetchCommitteeMember
  )
  return {
    committees: data?.data || [],
    isLoading,
    error,
  }
}

export default useCommitteeMember
