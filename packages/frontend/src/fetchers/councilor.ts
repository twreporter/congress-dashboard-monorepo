'use client'
// type
import type { CouncilDistrict } from '@/types/council'
import type { CouncilorWithBillCount } from '@/types/councilor'
import type { CouncilTopicForFilter } from '@/types/council-topic'

export type FetchTopCouncilorOfATopicParams = {
  topicSlug: string
  districtSlug: CouncilDistrict
  excludeCouncilorSlug: string
}
export const fetchTop5CouncilorOfATopic = async ({
  topicSlug,
  districtSlug,
  excludeCouncilorSlug,
}: FetchTopCouncilorOfATopicParams): Promise<CouncilorWithBillCount[]> => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL as string
  const url = `${apiBase}/council-topic/${topicSlug}/councilor?city=${districtSlug}&exclude=${excludeCouncilorSlug}&top=5`
  const res = await fetch(url, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch top 5 councilor of topic ${topicSlug}`)
  }
  const data = await res.json()
  return data?.data || []
}

type FetchTopicsOfACouncilorParams = {
  councilorSlug: string
  districtSlug: CouncilDistrict
}
export const fetchTopicsOfACouncilor = async ({
  councilorSlug,
  districtSlug,
}: FetchTopicsOfACouncilorParams): Promise<CouncilTopicForFilter[]> => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL as string
  const url = `${apiBase}/councilor/${councilorSlug}/topic?city=${districtSlug}`
  const res = await fetch(url, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch topics of councilor ${councilorSlug} in city ${districtSlug}`
    )
  }
  const data = await res.json()
  return data?.data || []
}
