'use client'

// @twreporter
import {
  MemberType,
  Constituency,
} from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'
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
export type LegislatorWithSpeechCount = {
  slug: string
  name: string
  avatar: string
  partyAvatar: string
  count: number
}

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
  const url = `${apiBase}/topic/${encodeURIComponent(
    topicSlug
  )}/legislator?key=term&mt=${encodeURIComponent(
    legislativeMeetingTerm
  )}&sts=${legislativeMeetingSessionTerms}&exclude=${encodeURIComponent(
    legislatorSlug
  )}&top=5`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
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
type keystoneImage = {
  imageFile: {
    url: string
  }
}
type LegislatorFromRes = {
  id: number
  legislator: {
    slug: string
    name: string
    imageLink?: string
    image?: keystoneImage
  }
  party: {
    image?: keystoneImage
  }
  type?: MemberType
  constituency?: Constituency
  tootip?: string
  note?: string
}[]
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
}: FetchLegislatorsParams): Promise<LegislatorFromRes> => {
  const url = `${apiBase}/legislator?mid=${encodeURIComponent(
    legislativeMeetingId
  )}&sids=${legislativeMeetingSessionIds}&pids=${partyIds}&cvs=${constituencies}&css=${committeeSlugs}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
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
export type TopNTopicFromRes = {
  id: number
  topics?: {
    id: number
    slug: string
    name: string
    count: number
  }[]
}
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
}: FetchTopNTopicsOfLegislatorsParams): Promise<TopNTopicFromRes[]> => {
  if (!legislatorIds || legislatorIds.length === 0) {
    return []
  }

  const url = `${apiBase}/index/legislator/${legislatorIds}/topic?mid=${encodeURIComponent(
    legislativeMeetingId
  )}&sids=${legislativeMeetingSessionIds}&top=${encodeURIComponent(take)}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
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
export type LegislatorForFilter = {
  id: number
  slug: string
  name: string
  imageLink?: string
  image?: { imageFile: { url: string } }
  count: number
}

type FetchLegislatorsOfATopicParams = {
  slug: string
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
}

export const fetchLegislatorsOfATopic = async ({
  slug,
  legislativeMeetingId,
  legislativeMeetingSessionIds,
}: FetchLegislatorsOfATopicParams) => {
  const url = `${apiBase}/topic/${encodeURIComponent(
    slug
  )}/legislator?key=id&mid=${encodeURIComponent(
    legislativeMeetingId
  )}&sids=${legislativeMeetingSessionIds}`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch legislators of a topic: ${slug}`)
  }
  const data = await res.json()
  return data?.data || []
}

/* fetchLegislatorsOfATopic
 *   fetch legislators of given topic and sort by speeches count desc
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
  const url = `${apiBase}/topic/${encodeURIComponent(
    topicSlug
  )}/legislator?key=id&mid=${encodeURIComponent(
    legislativeMeetingId
  )}&sids=${legislativeMeetingSessionIds}&pids=${partyIds}&cids=${constituencies}&css=${committeeSlugs}&top=${encodeURIComponent(
    take
  )}`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) {
    throw new Error('Failed to fetch top legislators')
  }

  const data = await res.json()
  return data?.data || []
}
