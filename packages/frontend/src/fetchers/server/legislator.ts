import { keystoneFetch } from '@/app/api/graphql/keystone'

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
}): Promise<LegislatorFromRes | undefined> => {
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
  const query = `
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
  `
  const variables = { where }

  try {
    const data = await keystoneFetch<{
      legislativeYuanMembers?: LegislatorFromRes[]
    }>(JSON.stringify({ query, variables }))
    return data?.data?.legislativeYuanMembers?.[0]
  } catch (err) {
    throw new Error(
      `Failed to fetch legislators for slug: ${slug}, err: ${err}`
    )
  }
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
  const query = `
    query TopicsByLegislator($where: TopicWhereInput!, $speechCondition: SpeechWhereInput!) {
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
    }
  `
  const variables = {
    where,
    speechCondition,
  }

  try {
    const data = await keystoneFetch<{ topics: TopicData[] }>(
      JSON.stringify({ query, variables })
    )
    return data?.data?.topics || []
  } catch (err) {
    throw new Error(
      `Failed to fetch topics for legislator for slug: ${slug}, err: ${err}`
    )
  }
}
