'use client'

import useSWR from 'swr'

export type speechData = {
  slug: string
  title: string
  date: string
  summary: string
}

type FetchSpeechesParams = {
  topicSlug: string
  legislatorSlug: string
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
}

const fetchSpeechesOfALegislatorInATopic = async ({
  topicSlug,
  legislatorSlug,
  legislativeMeetingId,
  legislativeMeetingSessionIds,
}: FetchSpeechesParams): Promise<speechData[]> => {
  if (!legislatorSlug || !topicSlug) {
    return []
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL as string
  let url = `${apiBase}/legislator/${encodeURIComponent(
    legislatorSlug
  )}/topic/${encodeURIComponent(topicSlug)}/speech?mid=${encodeURIComponent(
    legislativeMeetingId
  )}`
  if (legislativeMeetingSessionIds) {
    url = url.concat(`&sids=${legislativeMeetingSessionIds}`)
  }

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch speeches. topicSlug: ${topicSlug}, legislatorSlug: ${legislatorSlug}, meetingId: ${legislativeMeetingId}, sessionIds: ${legislativeMeetingSessionIds}`
    )
  }
  const data = await res.json()
  return data?.data || []
}
const useSpeech = (params?: FetchSpeechesParams) => {
  const { data, isLoading, error } = useSWR(
    params ? params : null,
    fetchSpeechesOfALegislatorInATopic
  )
  return {
    speeches: data,
    isLoading,
    error,
  }
}

export default useSpeech
