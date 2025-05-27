import { keystoneFetch } from '@/app/api/graphql/keystone'
import type { partyData } from '@/fetchers/party'

export type SpeechData = {
  slug: string
  summary: string
  title: string
  date: Date
  legislativeYuanMember: {
    legislator: {
      name: string
      slug: string
      imageLink?: string
      image?: {
        imageFile: {
          url: string
        }
      }
    }
  }
}

export type TopicData = {
  slug: string
  title: string
  speechesCount?: number
  speeches?: SpeechData[]
  relatedTopics?: {
    slug: string
    title: string
  }[]
  relatedTwreporterArticles?: string[]
}
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
        speeches(where: $speechesWhere) {
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
export type TopNTopicData = {
  title: string
  slug: string
  speechCount: number
  legislatorCount: number
  legislators: {
    id: number
    count: number
    name?: string
    slug: string
    party?: number | partyData
    imageLink?: string
    image?: {
      imageFile: {
        url: string
      }
    }
    avatar?: string
    partyAvatar?: string
  }[]
}[]
export const fetchTopNTopics = async ({
  take = 10,
  skip = 0,
  legislativeMeetingId,
}: FetchTopNTopicsParams): Promise<TopNTopicData | undefined> => {
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
      topicsOrderBySpeechCount: TopNTopicData
    }>(JSON.stringify({ query, variables }), false)
    return data?.data?.topicsOrderBySpeechCount
  } catch (err) {
    throw new Error(
      `Failed to fetch top N topics data for term ${legislativeMeetingId}, err: ${err}`
    )
  }
}
