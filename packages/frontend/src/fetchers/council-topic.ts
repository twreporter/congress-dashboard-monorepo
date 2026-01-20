'use client'
// type
import type { CouncilDistrict } from '@/types/council'
import type {
  CouncilTopicForFilter,
  TopNCouncilTopicData,
} from '@/types/council-topic'
import type { CouncilorWithBillCount } from '@/types/councilor'
import type { FetchTopNTopicsParams } from '@/fetchers/server/council-topic'

// global var
const apiBase = process.env.NEXT_PUBLIC_API_URL as string

export type FetchTop5TopicOfACouncilorParams = {
  councilorSlug: string
  districtSlug: CouncilDistrict
  excludeTopicSlug: string
}
export const fetchTop5TopicOfACouncilor = async ({
  councilorSlug,
  districtSlug,
  excludeTopicSlug,
}: FetchTop5TopicOfACouncilorParams): Promise<CouncilTopicForFilter[]> => {
  const url = `${apiBase}/councilor/${councilorSlug}/topic?city=${districtSlug}&exclude=${excludeTopicSlug}&top=5`
  const res = await fetch(url, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch top 5 topic of councilor ${councilorSlug}`)
  }
  const data = await res.json()
  return data?.data || []
}

type FetchCouncilorsOfATopicParams = {
  topicSlug: string
  districtSlug: CouncilDistrict
}
export const fetchCouncilorsOfATopic = async ({
  topicSlug,
  districtSlug,
}: FetchCouncilorsOfATopicParams): Promise<CouncilorWithBillCount[]> => {
  const url = `${apiBase}/council-topic/${topicSlug}/councilor?city=${districtSlug}`
  const res = await fetch(url, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch all councilors of a topic: ${topicSlug}`)
  }
  const data = await res.json()
  return data?.data || []
}

/* fetchTopNCouncilTopics
 * fetch top N council topics with given take & skip in given meeting
 *   top logic is order by bill count desc
 */
export const fetchTopNCouncilTopics = async ({
  take = 10,
  skip = 0,
  councilMeetingId,
  partyIds = [],
}: FetchTopNTopicsParams): Promise<TopNCouncilTopicData[]> => {
  if (!councilMeetingId) {
    throw new Error('CouncilMeetingId is required to fetch council topics')
  }
  const params = new URLSearchParams({
    mid: String(councilMeetingId),
    take: String(take),
    skip: String(skip),
  })
  if (partyIds && partyIds.length > 0) {
    params.set('pids', partyIds.join(','))
  }
  const url = `${apiBase}/council-topic?${params.toString()}`

  const res = await fetch(url, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch council topics of meetingId: ${councilMeetingId}, partyIds: ${partyIds}`
    )
  }
  const data = await res.json()
  return data?.data || []
}
