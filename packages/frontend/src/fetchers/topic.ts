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
}

export type TopTopic = {
  slug: string
  title: string
  speechesCount: number
}

export const fetchTopic = async ({
  slug,
  legislativeMeeting,
  legislativeMettingSession,
}: {
  slug: string
  legislativeMeeting: number
  legislativeMettingSession: number[]
}): Promise<TopicData> => {
  const url = process.env.NEXT_PUBLIC_API_URL as string
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
          in: legislativeMettingSession,
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
            title
            speechesCount(where: $speechesWhere)
          }
        }
      `,
      variables: where,
    }),
  })

  if (!res.ok) {
    throw new Error('Failed to fetch topic data')
  }

  const data = await res.json()
  return data?.data?.topic
}

export const fetchTopTopicsForLegislator = async ({
  legislatorSlug,
  legislativeMeeting,
  legislativeMettingSession,
}: {
  legislatorSlug: string
  legislativeMeeting: number
  legislativeMettingSession: number[]
}): Promise<TopTopic[]> => {
  // Changed return type to TopTopic[]
  const url = process.env.NEXT_PUBLIC_API_URL as string

  const speechesWhere = {
    legislativeMeeting: {
      term: {
        equals: legislativeMeeting,
      },
    },
    legislativeMeetingSession: {
      term: {
        in: legislativeMettingSession,
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
    throw new Error('Failed to fetch top topics for legislator')
  }

  const data = await res.json()

  // Sort topics by speech count because the GraphQL schema doesn't support ordering by speechesCount directly
  const sortedTopics = data.data.topics
    .filter((topic) => topic.speechesCount > 0)
    .sort((a, b) => b.speechesCount - a.speechesCount)
    .slice(0, 5)

  return sortedTopics
}
