'use client'

import useSWR from 'swr'
// type
import type { BillMeta } from '@/types/council-bill'

type FetchBillsParams = {
  topicSlug: string
  councilorSlug: string
  councilMeetingId: number
}

const fetchBillsOfACouncilorInATopic = async ({
  topicSlug,
  councilorSlug,
  councilMeetingId,
}: FetchBillsParams): Promise<BillMeta[]> => {
  if (!councilorSlug || !topicSlug) {
    return []
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL as string
  const url = `${apiBase}/councilor/${encodeURIComponent(
    councilorSlug
  )}/topic/${encodeURIComponent(topicSlug)}/bill?mid=${encodeURIComponent(
    councilMeetingId
  )}`

  const res = await fetch(url, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch bills. topicSlug: ${topicSlug}, councilorSlug: ${councilorSlug}, meetingId: ${councilMeetingId}`
    )
  }
  const data = await res.json()
  return data?.data || []
}

const useCouncilBill = (params?: FetchBillsParams) => {
  const { data, isLoading, error } = useSWR(
    params ? params : null,
    fetchBillsOfACouncilorInATopic
  )
  return {
    bills: data,
    isLoading,
    error,
  }
}

export default useCouncilBill
