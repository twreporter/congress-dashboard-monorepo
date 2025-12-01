'use client'

// type
import type { TopNTopicForLegislators } from '@/types/topic'
import type { LegislatorWithSpeechCount, LegislatorForIndex } from '@/types/legislator'
// lodash
import { isEmpty, filter, includes } from 'lodash'
const _ = {
  isEmpty,
  filter,
  includes,
}

// global var
const apiBase = process.env.NEXT_PUBLIC_API_URL as string

/* fetchTopLegislatorsBySpeechCount
 *   fetch top 5 legislators with most speeches of given topic in given term & session
 */

export const fetchTopLegislatorsBySpeechCount = async ({
  topicSlug,
  legislativeMeetingTerm,
  legislativeMeetingSessionTerms,
  legislatorSlug,
}: {
  topicSlug: string
  legislativeMeetingTerm: number
  legislativeMeetingSessionTerms: number[]
  legislatorSlug: string
}): Promise<LegislatorWithSpeechCount[]> => {
  if (!topicSlug) {
    return []
  }

  let url = `${apiBase}/topic/${encodeURIComponent(
    topicSlug
  )}/legislator?key=term&mt=${encodeURIComponent(legislativeMeetingTerm)}&top=5`
  if (legislativeMeetingSessionTerms) {
    url = url.concat(`&sts=${legislativeMeetingSessionTerms}`)
  }
  if (legislatorSlug) {
    url = url.concat(`&exclude=${encodeURIComponent(legislatorSlug)}`)
  }

  const res = await fetch(url, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch top legislators')
  }

  const data = await res.json()
  return data?.data || []
}

/* fetchLegislators
 *   fetch legislator data of given meeting term & party & constituency
 */
type FetchLegislatorsParams = {
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
  partyIds?: number[]
  constituencies?: string[]
  committeeSlugs?: string[]
}
export const fetchLegislators = async ({
  legislativeMeetingId,
  legislativeMeetingSessionIds,
  partyIds,
  constituencies,
  committeeSlugs,
}: FetchLegislatorsParams): Promise<LegislatorForIndex[]> => {
  let url = `${apiBase}/legislator?mid=${encodeURIComponent(
    legislativeMeetingId
  )}`
  if (legislativeMeetingSessionIds) {
    url = url.concat(`&sids=${legislativeMeetingSessionIds}`)
  }
  if (partyIds) {
    url = url.concat(`&pids=${partyIds}`)
  }
  if (constituencies) {
    url = url.concat(`&cvs=${constituencies}`)
  }
  if (committeeSlugs) {
    url = url.concat(`&css=${committeeSlugs}`)
  }

  const res = await fetch(url, {
    method: 'GET',
  })
  if (!res.ok) {
    throw new Error(
      `Failed to fetch legislators. meetingId: ${legislativeMeetingId}, partyIds: ${partyIds}, constituencies: ${constituencies}`
    )
  }
  const data = await res.json()
  return data?.data || []
}

/* fetchTopNTopicsOfLegislators
 *   fetch top N topics of given legislator ids in given meeting term & session
 */
type FetchTopNTopicsOfLegislatorsParams = {
  legislatorIds?: number[]
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
  take?: number
}
export const fetchTopNTopicsOfLegislators = async ({
  legislatorIds,
  legislativeMeetingId,
  legislativeMeetingSessionIds = [],
  take = 5,
}: FetchTopNTopicsOfLegislatorsParams): Promise<TopNTopicForLegislators[]> => {
  if (!legislatorIds || legislatorIds.length === 0) {
    return []
  }

  let url = `${apiBase}/index/legislator/${legislatorIds}/topic?mid=${encodeURIComponent(
    legislativeMeetingId
  )}`
  if (legislativeMeetingSessionIds) {
    url = url.concat(`&sids=${legislativeMeetingSessionIds}`)
  }
  if (take) {
    url = url.concat(`&top=${encodeURIComponent(take)}`)
  }

  const res = await fetch(url, {
    method: 'GET',
  })
  if (!res.ok) {
    throw new Error(
      `Failed to fetch top ${take} topics of legislator id: ${legislatorIds}. meetingId: ${legislativeMeetingId}, sessionIds: ${legislativeMeetingSessionIds}`
    )
  }
  const data = await res.json()
  return data?.data || []
}

/* fetchLegislatorsOfATopic
 *   fetch legislators of given topic and sort by speeches count desc
 */
type FetchLegislatorsOfATopicParams = {
  slug: string
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
}

export const fetchLegislatorsOfATopic = async ({
  slug,
  legislativeMeetingId,
  legislativeMeetingSessionIds,
}: FetchLegislatorsOfATopicParams): Promise<LegislatorWithSpeechCount[]> => {
  if (!slug) {
    return []
  }

  let url = `${apiBase}/topic/${encodeURIComponent(
    slug
  )}/legislator?key=id&mid=${encodeURIComponent(legislativeMeetingId)}`
  if (legislativeMeetingSessionIds) {
    url = url.concat(`&sids=${legislativeMeetingSessionIds}`)
  }

  const res = await fetch(url, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch legislators of a topic: ${slug}`)
  }
  const data = await res.json()
  return data?.data || []
}

/* fetchLegislatorsOfATopic
 *   fetch legislators of given topic and sort by speeches count desc with mutiple filters
 */
type FetchTopNLegislatorsOfATopicParams = {
  topicSlug: string
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
  partyIds?: number[]
  constituencies?: string[]
  committeeSlugs?: string[]
  take?: number
}
export const fetchTopNLegislatorsOfATopic = async ({
  topicSlug,
  legislativeMeetingId,
  legislativeMeetingSessionIds,
  partyIds,
  constituencies,
  committeeSlugs,
  take = 5,
}: FetchTopNLegislatorsOfATopicParams): Promise<
  LegislatorWithSpeechCount[]
> => {
  if (!topicSlug) {
    return []
  }

  let url = `${apiBase}/topic/${encodeURIComponent(
    topicSlug
  )}/legislator?key=id&mid=${encodeURIComponent(legislativeMeetingId)}`
  if (legislativeMeetingSessionIds) {
    url = url.concat(`&sids=${legislativeMeetingSessionIds}`)
  }
  if (partyIds) {
    url = url.concat(`&pids=${partyIds}`)
  }
  if (constituencies) {
    url = url.concat(`&cids=${constituencies}`)
  }
  if (committeeSlugs) {
    url = url.concat(`&css=${committeeSlugs}`)
  }
  if (take) {
    url = url.concat(`&top=${encodeURIComponent(take)}`)
  }

  const res = await fetch(url, {
    method: 'GET',
  })
  if (!res.ok) {
    throw new Error('Failed to fetch top legislators')
  }

  const data = await res.json()
  return data?.data || []
}
