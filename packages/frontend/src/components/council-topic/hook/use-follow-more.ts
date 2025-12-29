'use client'
import useSWR from 'swr'
// fetcher
import { fetchTop5TopicOfACouncilor } from '@/fetchers/council-topic'
// type
import type { CouncilTopicForFilter } from '@/types/council-topic'
import type { FetchTop5TopicOfACouncilorParams } from '@/fetchers/council-topic'

type StateType<T> = {
  topTopics: T[]
  isLoading: boolean
  error?: Error
}
const useFollowMore = (
  params: FetchTop5TopicOfACouncilorParams | null
): StateType<CouncilTopicForFilter> => {
  const { data, isLoading, error } = useSWR(
    params ? params : null,
    fetchTop5TopicOfACouncilor
  )
  return {
    topTopics: data || [],
    isLoading,
    error,
  }
}

export default useFollowMore
