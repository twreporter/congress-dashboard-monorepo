'use client'
import useSWR from 'swr'
// fetcher
import { fetchTop5CouncilorOfATopic } from '@/fetchers/councilor'
// type
import type { CouncilorWithBillCount } from '@/types/councilor'
import type { FetchTopCouncilorOfATopicParams } from '@/fetchers/councilor'

type StateType<T> = {
  topCouncilors: T[]
  isLoading: boolean
  error?: Error
}
const useFollowMore = (
  params: FetchTopCouncilorOfATopicParams | null
): StateType<CouncilorWithBillCount> => {
  const { data, isLoading, error } = useSWR(
    params ? params : null,
    fetchTop5CouncilorOfATopic
  )
  return {
    topCouncilors: data || [],
    isLoading,
    error,
  }
}

export default useFollowMore
