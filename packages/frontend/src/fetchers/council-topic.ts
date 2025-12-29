'use client'
// type
import type { CouncilDistrict } from '@/types/council'
import type { CouncilTopicForFilter } from '@/types/council-topic'
import type { CouncilorWithBillCount } from '@/types/councilor'

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
  const apiBase = process.env.NEXT_PUBLIC_API_URL as string
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
  const apiBase = process.env.NEXT_PUBLIC_API_URL as string
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
