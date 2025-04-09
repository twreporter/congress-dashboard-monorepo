// global var
const API_URL = 'http://localhost:3000/api/graphql' // use localhost in ssr

/* fetchLegislator
 *   fetch legislative with given slug and in given term
 */
export type LegislatorFromRes = {
  slug: string
  party: {
    name: string
    image: {
      imageFile: {
        url: string
      }
    }
    imageLink: string
  }
  note: string
  legislativeMeeting: {
    term: number
  }
  constituency: string
  type: string
  sessionAndCommittee: {
    committee: {
      name: string
    }[]
    legislativeMeetingSession: {
      term: number
    }
  }[]
  legislator: {
    name: string
    slug: string
    image: {
      imageFile: {
        url: string
      }
    }
    imageLink: string
  }
}

export const fetchLegislator = async ({
  slug,
  legislativeMeeting,
}: {
  slug: string
  legislativeMeeting: number
}): Promise<LegislatorFromRes> => {
  const where = {
    legislator: {
      slug: {
        equals: slug,
      },
    },
    legislativeMeeting: {
      term: {
        equals: legislativeMeeting,
      },
    },
  }

  const res = await fetch(API_URL, {
    signal: AbortSignal.timeout(30000),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query LegislativeYuanMembers($where: LegislativeYuanMemberWhereInput!) {
          legislativeYuanMembers(where: $where) {
            party {
              name
              image {
                imageFile {
                  url
                }
              }
              imageLink
            }
            note
            legislativeMeeting {
              term
            }
            constituency
            type
            legislator {
              name
              slug
              image {
                imageFile {
                  url
                }
              }
              imageLink
            }
            sessionAndCommittee {
              committee {
                name
              }
              legislativeMeetingSession {
                term
              }
            }
          }
        }
      `,
      variables: { where },
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch legislator data for slug: ${slug}`)
  }

  const data = await res.json()
  return data?.data?.legislativeYuanMembers?.[0]
}

/* fetchLegislatorTopics
 *   fetch topics which given legislator has speech in given term & session
 */
export type SpeechData = {
  slug: string
  title: string
  date: string
  summary: string
}

export type TopicData = {
  title: string
  slug: string
  speechesCount: number
  speeches: SpeechData[]
}

export const fetchLegislatorTopics = async ({
  slug,
  legislativeMeetingTerm,
  legislativeMeetingSessionTerms,
}: {
  slug: string
  legislativeMeetingTerm: number
  legislativeMeetingSessionTerms: number[]
}): Promise<TopicData[]> => {
  // Create where conditions for topics
  const where = {
    speeches: {
      some: {
        legislativeYuanMember: {
          legislator: {
            slug: {
              equals: slug,
            },
          },
        },
        legislativeMeeting: {
          term: {
            equals: legislativeMeetingTerm,
          },
        },
        legislativeMeetingSession: {
          term: {
            in: legislativeMeetingSessionTerms,
          },
        },
      },
    },
  }

  // Create the speech condition for the speechesCount
  const speechCondition = {
    legislativeYuanMember: {
      legislator: {
        slug: { equals: slug },
      },
    },
    legislativeMeeting: {
      term: { equals: legislativeMeetingTerm },
    },
    legislativeMeetingSession: {
      term: { in: legislativeMeetingSessionTerms },
    },
  }

  const res = await fetch(API_URL, {
    signal: AbortSignal.timeout(30000),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query TopicsByLegislator($where: TopicWhereInput!, $speechCondition: SpeechWhereInput!) {
        topics(where: $where) {
          title
          slug
          speechesCount(where: $speechCondition)
          speeches(where: $speechCondition) {
            slug
            date
            title
            summary
          }
        }
      }`,
      variables: {
        where,
        speechCondition,
      },
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch topics for legislator for slug: ${slug}`)
  }

  const data = await res.json()
  return data?.data?.topics
}
