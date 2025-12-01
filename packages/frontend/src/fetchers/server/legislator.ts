import { keystoneFetch } from '@/app/api/_graphql/keystone'
// type
import type { TopicDataForLegislator } from '@/types/topic'
import type { Legislator, LegislatorForSitemap } from '@/types/legislator'

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
}): Promise<Legislator | undefined> => {
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
        isActive
      }
    }
  `
  const variables = { where }

  try {
    const data = await keystoneFetch<{
      legislativeYuanMembers?: Legislator[]
    }>(JSON.stringify({ query, variables }), false)
    return data?.data?.legislativeYuanMembers?.[0]
  } catch (err) {
    throw new Error(
      `Failed to fetch legislators for slug: ${slug}, err: ${err}`
    )
  }
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
}): Promise<TopicDataForLegislator[]> => {
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
        speeches(where: $speechCondition, orderBy: { date: desc }) {
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
    const data = await keystoneFetch<{ topics: TopicDataForLegislator[] }>(
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
        updatedAt
      }
    }
  `
  try {
    const data = await keystoneFetch<{
      legislators: LegislatorForSitemap[]
    }>(JSON.stringify({ query }), false)
    return data?.data?.legislators
  } catch (err) {
    throw new Error(`Failed to fetch all legislators, err: ${err}`)
  }
}
