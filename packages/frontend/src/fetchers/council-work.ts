'use client'

import useSWR from 'swr'
import type { CouncilWorkData } from '@/types/council-work'

type FetchCouncilWorkParams = {
  topicSlug: string
  councilorSlug: string
  councilMeetingId: number
}

const emptyData: CouncilWorkData = {
  work: [],
  speechCount: 0,
  billCount: 0,
}

const fetchCouncilWork = async ({
  topicSlug,
  councilorSlug,
  councilMeetingId,
}: FetchCouncilWorkParams): Promise<CouncilWorkData> => {
  if (!councilorSlug || !topicSlug) return emptyData

  const apiBase = process.env.NEXT_PUBLIC_API_URL as string
  const params = new URLSearchParams({ mid: String(councilMeetingId) })
  const url = `${apiBase}/councilor/${encodeURIComponent(
    councilorSlug
  )}/topic/${encodeURIComponent(topicSlug)}/work?${params.toString()}`
  const res = await fetch(url, { method: 'GET' })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch work. topicSlug: ${topicSlug}, councilorSlug: ${councilorSlug}, meetingId: ${councilMeetingId}`
    )
  }
  const data = await res.json()
  return data?.data || emptyData
}

const useCouncilWork = (params?: FetchCouncilWorkParams) => {
  const { data, isLoading, error } = useSWR(
    params ? params : null,
    fetchCouncilWork
  )
  return {
    work: data?.work || [],
    speechCount: data?.speechCount || 0,
    billCount: data?.billCount || 0,
    isLoading,
    error,
  }
}

export default useCouncilWork
