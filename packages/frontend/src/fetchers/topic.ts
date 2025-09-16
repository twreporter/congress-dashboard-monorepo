'use client'

// type
import type {
  FetchTopNTopicsParams,
  TopNTopicData,
} from '@/fetchers/server/topic'

// global var
const apiBase = process.env.NEXT_PUBLIC_API_URL as string

/* fetchTopTopicsForLegislator
 *   fetch top 5 topic which given legislator has more speeches in given terms & session
 */
export type Topic = {
  slug: string
  name: string
  count: number
}

export const fetchTopTopicsForLegislator = async ({
  legislatorSlug,
  legislativeMeeting,
  legislativeMeetingSession,
}: {
  legislatorSlug: string
  legislativeMeeting: number
  legislativeMeetingSession: number[]
}): Promise<Topic[]> => {
  const url = `${apiBase}/legislator/${encodeURIComponent(
    legislatorSlug
  )}/topic?key=term&mt=${encodeURIComponent(
    legislativeMeeting
  )}&sts=${legislativeMeetingSession}&top=5`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch top topics for legislator slug: ${legislatorSlug}`
    )
  }

  const data = await res.json()
  return data?.data
}

/* fetchTopNTopics
 * fetch top N topics with give take & skip in given meeting & session
 *   top logic is order by speech count desc
 */
export const fetchTopNTopics = async ({
  take = 10,
  skip = 0,
  legislativeMeetingId,
  legislativeMeetingSessionIds = [],
  partyIds = [],
}: FetchTopNTopicsParams): Promise<TopNTopicData> => {
  const url = `${apiBase}/topic?mid=${encodeURIComponent(
    legislativeMeetingId
  )}&sids=${legislativeMeetingSessionIds}&pids=${partyIds}&take=${encodeURIComponent(
    take
  )}&skip=${encodeURIComponent(skip)}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch topics of meetingId: ${legislativeMeetingId}, sessionIds: ${legislativeMeetingSessionIds}, partyIds: ${partyIds}`
    )
  }
  const data = await res.json()
  return data?.data || []
}

/* fetchTopicOfALegislator
 *   fetch topics which given legislator has & sort by speeched count desc
 */
export type TopicForFilter = {
  slug: string
  name: string
  count: number
}

type FetchTopicOfALegislatorParams = {
  slug: string
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
}

export const fetchTopicOfALegislator = async ({
  slug,
  legislativeMeetingId,
  legislativeMeetingSessionIds,
}: FetchTopicOfALegislatorParams) => {
  const url = `${apiBase}/legislator/${encodeURIComponent(
    slug
  )}/topic?key=id&mid=${encodeURIComponent(
    legislativeMeetingId
  )}&sids=${legislativeMeetingSessionIds}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch topics of a legislator: ${slug}`)
  }
  const data = await res.json()
  return data?.data
}
