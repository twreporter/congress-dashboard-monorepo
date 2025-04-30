import { keystoneFetch } from '@/app/api/graphql/keystone'

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
