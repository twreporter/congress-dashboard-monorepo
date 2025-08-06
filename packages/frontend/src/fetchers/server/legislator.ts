import { keystoneFetch } from '@/app/api/graphql/keystone'

export type LegislatorFromRes = {
  proposalSuccessCount?: number
  party: {
    name: string
    image?: {
      imageFile: {
        url: string
      }
    }
    imageLink?: string
  }
  note?: string
  tooltip?: string
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
    image?: {
      imageFile: {
        url: string
      }
    }
    imageLink?: string
    externalLink?: string
    meetingTermCount?: number
    meetingTermCountInfo?: string
  }
}

/** checkLegislatorExist
 *  check if legislator exist with given slug
 */
export const checkLegislatorExist = async ({
  slug,
}: {
  slug: string
}): Promise<boolean> => {
  const where = {
    slug,
  }
  const query = `
    query Legislator($where: LegislatorWhereUniqueInput!) {
      legislator(where: $where) {
        slug
      }
    }
  `
  const variables = { where }
  try {
    const data = await keystoneFetch<{
      legislator: { slug: string }
    }>(JSON.stringify({ query, variables }), false)
    return Boolean(data?.data?.legislator?.slug)
  } catch (err) {
    throw new Error(
      `Failed to check if legislator exists for slug: ${slug}, err: ${err}`
    )
  }
}

/** getLegislatorMeetingTerms
 *  get legislator's all meeting terms return in descending order by term
 */
export const getLegislatorMeetingTerms = async ({
  slug,
}: {
  slug: string
}): Promise<string[]> => {
  const where = {
    legislator: {
      slug: {
        equals: slug,
      },
    },
  }
  const query = `
    query LegislativeYuanMembers($where: LegislativeYuanMemberWhereInput!) {
      legislativeYuanMembers(where: $where) {
        legislativeMeeting {
          term
        }
      }
    }
  `
  const variables = { where }

  try {
    const data = await keystoneFetch<{
      legislativeYuanMembers: { legislativeMeeting: { term: number } }[]
    }>(JSON.stringify({ query, variables }), false)
    return (
      data?.data?.legislativeYuanMembers
        .map((m) => m.legislativeMeeting.term)
        .sort((a, b) => b - a)
        .map(String) || []
    )
  } catch (err) {
    throw new Error(
      `Failed to fetch legislators for slug: ${slug}, err: ${err}`
    )
  }
}

/** fetchLegislator
 *   fetch legislative with given slug and in given term
 */
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
        proposalSuccessCount
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
        tooltip
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
          externalLink
          meetingTermCount
          meetingTermCountInfo
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
    }>(JSON.stringify({ query, variables }), false)
    return data?.data?.legislativeYuanMembers?.[0]
  } catch (err) {
    throw new Error(
      `Failed to fetch legislators for slug: ${slug}, err: ${err}`
    )
  }
}

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

/** fetchLegislatorTopics
 *   fetch topics which given legislator has speech in given term & session
 */
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
      JSON.stringify({ query, variables }),
      false
    )
    return data?.data?.topics || []
  } catch (err) {
    throw new Error(
      `Failed to fetch topics for legislator for slug: ${slug}, err: ${err}`
    )
  }
}

/**
 * fetch all legislators slug for sitemap
 */
export const fetchAllLegislatorsSlug = async () => {
  const query = `
    query GetAllLegislatorsSlug {
      legislators {
        slug
      }
    }
  `
  try {
    const data = await keystoneFetch<{ legislators: { slug: string }[] }>(
      JSON.stringify({ query }),
      false
    )
    return data?.data?.legislators
  } catch (err) {
    throw new Error(`Failed to fetch all parties, err: ${err}`)
  }
}
