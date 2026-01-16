import useSWR from 'swr'
// type
import type { CouncilTopicForFilter } from '@/types/council-topic'
import type { CouncilorWithBillCount } from '@/types/councilor'

// useMoreCouncilTopics - get top topics for a councilor (excluding current topic)
type TopicStateType<T> = {
  topics: T
  isLoading: boolean
  error?: Error
}

type FetchMoreCouncilTopicsParams = {
  councilorSlug: string
  excludeTopicSlug: string
  city: string
}

const fetchMoreCouncilTopics = async ({
  councilorSlug,
  excludeTopicSlug,
  city,
}: FetchMoreCouncilTopicsParams): Promise<CouncilTopicForFilter[]> => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL as string
  const url = `${apiBase}/councilor/${encodeURIComponent(
    councilorSlug
  )}/topic?city=${encodeURIComponent(city)}&exclude=${encodeURIComponent(
    excludeTopicSlug
  )}&top=5`

  const res = await fetch(url, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch topics for councilor ${councilorSlug}. city: ${city}`
    )
  }
  const data = await res.json()
  return data?.data || []
}

export const useMoreCouncilTopics = (
  params?: FetchMoreCouncilTopicsParams
): TopicStateType<CouncilTopicForFilter[]> => {
  const { data, isLoading, error } = useSWR<CouncilTopicForFilter[]>(
    params ? params : null,
    fetchMoreCouncilTopics
  )
  return {
    topics: data || [],
    isLoading,
    error,
  }
}

// useMoreCouncilors - get top councilors for a topic (excluding current councilor)
type CouncilorStateType<T> = {
  councilors: T[]
  isLoading: boolean
  error?: Error
}

type FetchMoreCouncilorsParams = {
  topicSlug: string
  excludeCouncilorSlug: string
  city: string
}

const fetchMoreCouncilors = async ({
  topicSlug,
  excludeCouncilorSlug,
  city,
}: FetchMoreCouncilorsParams): Promise<CouncilorWithBillCount[]> => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL as string
  const url = `${apiBase}/council-topic/${encodeURIComponent(
    topicSlug
  )}/councilor?city=${encodeURIComponent(city)}&exclude=${encodeURIComponent(
    excludeCouncilorSlug
  )}&top=5`

  const res = await fetch(url, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch councilors for topic ${topicSlug}. city: ${city}`
    )
  }
  const data = await res.json()
  return data?.data || []
}

export const useMoreCouncilors = (
  params?: FetchMoreCouncilorsParams
): CouncilorStateType<CouncilorWithBillCount> => {
  const { data, isLoading, error } = useSWR<CouncilorWithBillCount[]>(
    params ? params : null,
    fetchMoreCouncilors
  )
  return {
    councilors: data || [],
    isLoading,
    error,
  }
}
