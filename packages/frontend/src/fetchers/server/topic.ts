import { keystoneFetch } from '@/app/api/_graphql/keystone'
// type
import type { TopicData, TopNTopicData } from '@/types/topic'
import type { SitemapItem } from '@/types'

/** fetchTopic
 *   fetch topics with give slug in given terms & session
 */
export const fetchTopic = async ({
  slug,
  legislativeMeeting,
  legislativeMeetingSession,
}: {
  slug: string
  legislativeMeeting: number
  legislativeMeetingSession: number[]
}): Promise<TopicData | undefined> => {
  const where = {
    where: {
      slug: slug,
    },
    speechesWhere: {
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
    },
  }
  const query = `
    query Topic($where: TopicWhereUniqueInput!, $speechesWhere: SpeechWhereInput!) {
      topic(where: $where) {
        speeches(where: $speechesWhere, orderBy: { date: desc }) {
          slug
          summary
          title
          date
          legislativeYuanMember {
            legislator {
              name
              slug
              imageLink
              image {
                imageFile {
                  url
                }
              }
            }
          }
          legislativeMeeting {
            term
          }
          legislativeMeetingSession {
            term
          }
        }
        slug
        title
        speechesCount(where: $speechesWhere)
        relatedTopics {
          slug
          title
        }
        relatedTwreporterArticles
        relatedCouncilTopic {
          slug
          title
          city
        }
      }
    }
  `
  const variables = where

  try {
    const data = await keystoneFetch<{ topic: TopicData }>(
      JSON.stringify({ query, variables }),
      false
    )
    return data?.data?.topic
  } catch (err) {
    throw new Error(`Failed to fetch topic data for slug: ${slug}, err: ${err}`)
  }
}

/* fetchTopNTopics
 *   fetch top N topics with give take & skip in given meeting & session
 *   top logic is order by speech count desc
 */
export type FetchTopNTopicsParams = {
  take?: number
  skip?: number
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
  partyIds?: number[]
}
export const fetchTopNTopics = async ({
  take = 10,
  skip = 0,
  legislativeMeetingId,
}: FetchTopNTopicsParams): Promise<TopNTopicData[] | undefined> => {
  const query = `
    query TopicsOrderBySpeechCount($meetingId: Int!, $take: Int, $skip: Int) {
      topicsOrderBySpeechCount(meetingId: $meetingId, take: $take, skip: $skip) {
        legislatorCount
        slug
        speechCount
        title
        legislators {
          id
          count
          name
          imageLink
          slug
          party
          image {
            imageFile {
              url
            }
          }
        }
      }
    }
  `
  const variables = {
    take,
    skip,
    meetingId: Number(legislativeMeetingId),
  }

  try {
    const data = await keystoneFetch<{
      topicsOrderBySpeechCount: TopNTopicData[]
    }>(JSON.stringify({ query, variables }), false)
    return data?.data?.topicsOrderBySpeechCount
  } catch (err) {
    throw new Error(
      `Failed to fetch top N topics data for term ${legislativeMeetingId}, err: ${err}`
    )
  }
}

/**
 * fetch all topics slug for sitemap
 */
export const fetchAllTopicsSlug = async (): Promise<SitemapItem[]> => {
  const query = `
    query Topics {
      topics {
        slug
        updatedAt
      }
    }
  `

  try {
    const data = await keystoneFetch<{
      topics: SitemapItem[]
    }>(JSON.stringify({ query }), false)
    return data?.data?.topics || []
  } catch (err) {
    throw new Error(`Failed to fetch all topics slug, err: ${err}`)
  }
}
