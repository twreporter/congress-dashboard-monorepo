import keystoneFetch from '@/app/api/_graphql/keystone'
// utils
import { sortByCountDesc } from '@/fetchers/utils'
// enum
import { FilterKey } from '@/app/api/legislator/[slug]/topic/enum-constant'
// type
import type { Topic } from '@/types/topic'

type TopicFromRes = {
  slug: string
  title: string
  speechesCount: number
}

type TopicToReturn = Topic

const topicFormmater = (topics: TopicFromRes[]): TopicToReturn[] => {
  const topicsWithCounts = topics.map((topicFromRes) => ({
    count: topicFromRes.speechesCount,
    name: topicFromRes.title,
    ...topicFromRes,
  }))
  const topicOrderBySpeechCount = topicsWithCounts
    .filter((topic) => topic.count > 0)
    .sort(sortByCountDesc)
  return topicOrderBySpeechCount
}

type FetchTopicsOfALegislatorParams = {
  key: FilterKey
  slug: string
  legislativeMeeting: number
  legislativeMeetingSessions?: number[]
  top?: number
}

const fetchTopicsOfALegislator = async ({
  key,
  slug,
  legislativeMeeting,
  legislativeMeetingSessions,
  top,
}: FetchTopicsOfALegislatorParams) => {
  const query = `
    query TopTopicsForLegislator($speechesWhere: SpeechWhereInput!) {
      topics {
        slug
        title
        speechesCount(where: $speechesWhere)
      }
    }
  `
  const variables = {
    speechesWhere: {
      legislativeMeeting: {
        [key]: {
          equals: legislativeMeeting,
        },
      },
      legislativeYuanMember: {
        legislator: {
          slug: {
            equals: slug,
          },
        },
      },
    },
  }
  if (legislativeMeetingSessions && legislativeMeetingSessions.length > 0) {
    variables.speechesWhere['legislativeMeetingSession'] = {
      [key]: {
        in: legislativeMeetingSessions,
      },
    }
  }
  const data = await keystoneFetch<{ topics: TopicFromRes[] }>(
    JSON.stringify({ query, variables }),
    false
  )

  const topics = data?.data?.topics || []
  const topicOrderBySpeechCount = topicFormmater(topics)
  if (!top) {
    return topicOrderBySpeechCount
  }
  return topicOrderBySpeechCount.slice(0, top)
}

export default fetchTopicsOfALegislator
