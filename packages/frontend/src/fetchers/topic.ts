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

export const fetchTopic = async ({
  slug,
  legislativeMeeting,
  legislativeMettingSession,
}: {
  slug: string
  legislativeMeeting: number
  legislativeMettingSession: number[]
}) => {
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
  return data
}
