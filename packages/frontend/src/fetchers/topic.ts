import { sortByCountDesc } from '@/fetchers/utils'

/* fetchTopTopicsForLegislator
 *   fetch top 5 topic which given legislator has more speeches in given terms & session
 */
export type TopTopic = {
  slug: string
  title: string
  speechesCount: number
}

export const fetchTopTopicsForLegislator = async ({
  legislatorSlug,
  legislativeMeeting,
  legislativeMeetingSession,
}: {
  legislatorSlug: string
  legislativeMeeting: number
  legislativeMeetingSession: number[]
}): Promise<TopTopic[]> => {
  const url = process.env.NEXT_PUBLIC_API_URL as string
  const speechesWhere = {
    legislativeMeeting: {
      term: {
        equals: legislativeMeeting,
      },
    },
    legislativeMeetingSession: {
      term: {
        in: legislativeMeetingSession,
      },
    },
    legislativeYuanMember: {
      legislator: {
        slug: {
          equals: legislatorSlug,
        },
      },
    },
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query TopTopicsForLegislator($speechesWhere: SpeechWhereInput!) {
          topics {
            slug
            title
            speechesCount(where: $speechesWhere)
          }
        }
      `,
      variables: {
        speechesWhere,
      },
    }),
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch top topics for legislator slug: ${legislatorSlug}`
    )
  }

  const data = await res.json()

  // Sort topics by speech count because the GraphQL schema doesn't support ordering by speechesCount directly
  const sortedTopics = data.data.topics
    .filter((topic) => topic.speechesCount > 0)
    .sort((a, b) => b.speechesCount - a.speechesCount)
    .slice(0, 5)

  return sortedTopics
}

/* fetchTopicOfALegislator
 *   fetch topics which given legislator has & sort by speeched count desc
 */
export type TopicForFilter = {
  slug: string
  name: string
  count: number
}

const fetchTopicOfALegislator = async (legislatorSlug: string) => {
  const url = process.env.NEXT_PUBLIC_API_URL as string
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query GetTopicOfALegislator($speechesWhere: SpeechWhereInput!) {
          topics {
            slug
            title
            speechesCount(where: $speechesWhere)
          }
        }
      `,
      variables: {
        speechesWhere: {
          legislativeYuanMember: {
            legislator: {
              slug: {
                equals: legislatorSlug,
              },
            },
          },
        },
      },
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch topics of a legislator: ${legislatorSlug}`)
  }
  const data = await res.json()

  // map data & sort by speech counts
  const topics = data?.data?.topics || []
  const topicsWithCounts: TopicForFilter[] = topics.map((topicFromRes) => ({
    count: topicFromRes.speechesCount,
    name: topicFromRes.title,
    ...topicFromRes,
  }))
  const topicOrderBySpeechCount = topicsWithCounts
    .filter((topic) => topic.count > 0)
    .sort(sortByCountDesc)
  return topicOrderBySpeechCount
}

export default fetchTopicOfALegislator
