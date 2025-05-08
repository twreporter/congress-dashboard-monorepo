import useSWR from 'swr'
// fetcher
import {
  fetchTopNTopicsOfLegislators,
  fetchTopNLegislatorsOfATopic,
} from '@/fetchers/legislator'
// type
import type {
  TopNTopicFromRes,
  LegislatorWithSpeechCount,
} from '@/fetchers/legislator'
// lodash
import { remove } from 'lodash'
const _ = {
  remove,
}

// useMoreTopics
type TopicStateType<T> = {
  topics: T
  isLoading: boolean
  error?: Error
}

type FetchMoreTopicsParams = {
  legislatorId: number
  excluideTopicSlug: string
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
}
const fetchMoreTopics = async ({
  legislatorId,
  excluideTopicSlug,
  legislativeMeetingId,
  legislativeMeetingSessionIds,
}: FetchMoreTopicsParams) => {
  const legislatorWithTopics: TopNTopicFromRes[] =
    await fetchTopNTopicsOfLegislators({
      legislatorIds: [legislatorId],
      legislativeMeetingId,
      legislativeMeetingSessionIds,
      take: 6,
    })

  const topics = legislatorWithTopics[0]?.topics
  if (!topics || topics.length === 0) {
    return []
  }

  _.remove(topics, (topic) => topic.slug === excluideTopicSlug)
  return topics.slice(0, 5)
}
export const useMoreTopics = (
  params?: FetchMoreTopicsParams
): TopicStateType<TopNTopicFromRes['topics']> => {
  const { data, isLoading, error } = useSWR(
    params ? params : null,
    fetchMoreTopics
  )
  return {
    topics: data,
    isLoading,
    error,
  }
}

// useMoreLegislators
type LegislatorStateType<T> = {
  legislators: T[]
  isLoading: boolean
  error?: Error
}

type FetchMoreLegislatorsParams = {
  topicSlug: string
  excluideLegislatorSlug: string
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
  partyIds?: number[]
  constituencies?: string[]
  committeeSlugs?: string[]
}
const fetchMoreLegislators = async ({
  topicSlug,
  excluideLegislatorSlug,
  legislativeMeetingId,
  legislativeMeetingSessionIds,
  partyIds,
  constituencies,
  committeeSlugs,
}: FetchMoreLegislatorsParams) => {
  const legislators = await fetchTopNLegislatorsOfATopic({
    topicSlug,
    legislativeMeetingId,
    legislativeMeetingSessionIds,
    partyIds,
    constituencies,
    committeeSlugs,
    take: 6,
  })

  _.remove(
    legislators,
    (legislator) => legislator.slug === excluideLegislatorSlug
  )
  return legislators.slice(0, 5)
}

export const useMoreLegislators = (
  params?: FetchMoreLegislatorsParams
): LegislatorStateType<LegislatorWithSpeechCount> => {
  const { data, isLoading, error } = useSWR(
    params ? params : null,
    fetchMoreLegislators
  )
  return {
    legislators: data || [],
    isLoading,
    error,
  }
}
