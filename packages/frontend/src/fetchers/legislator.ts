'use client'

import { getImageLink, sortByCountDesc } from '@/fetchers/utils'

/* fetchTopLegislatorsBySpeechCount
 *   fetch top 5 legislators with most speeches of given topic in given term & session
 */
export type LegislatorWithSpeechCount = {
  slug: string
  name: string
  avatar: string
  partyAvatar: string
  count: number
}

export const fetchTopLegislatorsBySpeechCount = async ({
  topicSlug,
  legislativeMeetingTerm,
  legislativeMeetingSessionTerms,
  legislatorSlug,
}: {
  topicSlug: string
  legislativeMeetingTerm: number
  legislativeMeetingSessionTerms: number[]
  legislatorSlug: string
}): Promise<LegislatorWithSpeechCount[]> => {
  const url = process.env.NEXT_PUBLIC_API_URL as string
  const speechesWhere = {
    AND: [
      {
        topics: {
          some: {
            slug: {
              equals: topicSlug,
            },
          },
        },
      },
      {
        legislativeMeeting: {
          term: {
            equals: legislativeMeetingTerm,
          },
        },
      },
      {
        legislativeMeetingSession: {
          term: {
            in: legislativeMeetingSessionTerms,
          },
        },
      },
      {
        legislativeYuanMember: {
          legislator: {
            slug: {
              not: {
                equals: legislatorSlug,
              },
            },
          },
        },
      },
    ],
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query GetTopLegislatorsBySpeechCount($where: SpeechWhereInput!) {
          speeches(where: $where) {
            legislativeYuanMember {
              legislator {
                slug
                name
                image {
                  imageFile {
                    url
                  }
                }
                imageLink
              }
              party {
                image {
                  imageFile {
                    url
                  }
                }
                imageLink
              }
            }
          }
        }
      `,
      variables: {
        where: speechesWhere,
      },
    }),
  })

  if (!res.ok) {
    throw new Error('Failed to fetch top legislators')
  }

  const data = await res.json()
  const speeches = data?.data?.speeches || []

  // Count speeches by legislator
  const legislatorCounts: LegislatorWithSpeechCount[] = speeches.reduce(
    (acc, speech) => {
      const legislator = speech.legislativeYuanMember?.legislator
      if (!legislator) return acc

      const slug = legislator.slug
      if (!acc[slug]) {
        acc[slug] = {
          ...legislator,
          avatar: getImageLink(legislator),
          partyAvatar: getImageLink(speech.legislativeYuanMember.party),
          count: 0,
        }
      }
      acc[slug].count++
      return acc
    },
    {}
  )

  // Convert to array, sort by count, and take top 5
  const topLegislators = Object.values(legislatorCounts)
    .sort(sortByCountDesc)
    .slice(0, 5)

  return topLegislators
}

/* fetchLegislators
 *   fetch legislator data of given meeting term & party & constituency
 */
type keystoneImage = {
  imageFile: {
    url: string
  }
}
type LegislatorFromRes = {
  id: number
  legislator: {
    slug: string
    name: string
    imageLink?: string
    image?: keystoneImage
  }
  party: {
    image?: keystoneImage
  }
  constituency?: string
  tootip?: string
  note?: string
}[]
type FetchLegislatorsParams = {
  legislativeMeetingId: number
  partyIds?: number[]
  constituencies?: string[]
}
export const fetchLegislators = async ({
  legislativeMeetingId,
  partyIds,
  constituencies,
}: FetchLegislatorsParams): Promise<LegislatorFromRes> => {
  const query = `
    query LegislativeYuanMembers($where: LegislativeYuanMemberWhereInput!) {
      legislativeYuanMembers(where: $where) {
        id,
        legislator {
          slug
          imageLink
          image {
            imageFile {
              url
            }
          }
          name
        }
        constituency
        party {
          image {
            imageFile {
              url
            }
          }
          imageLink
        }
        tooltip
        note
      }
    }
  `
  const where = {
    legislativeMeeting: {
      id: {
        equals: legislativeMeetingId,
      },
    },
  }
  if (partyIds && partyIds.length > 0) {
    where['party'] = {
      id: {
        in: partyIds,
      },
    }
  }
  if (constituencies && constituencies.length > 0) {
    where['constituency'] = {
      in: constituencies,
    }
  }

  const url = process.env.NEXT_PUBLIC_API_URL as string
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { where } }),
  })
  if (!res.ok) {
    throw new Error(
      `Failed to fetch legislators. meetingId: ${legislativeMeetingId}, partyIds: ${partyIds}, constituencies: ${constituencies}`
    )
  }
  const data = await res.json()
  const legislators: LegislatorFromRes =
    data?.data?.legislativeYuanMembers || []
  return legislators
}

/* fetchTopNTopicsOfLegislators
 *   fetch top N topics of given legislator ids in given meeting term & session
 */
type TopNTopicFromRes = {
  id: number
  topics?: {
    id: number
    slug: string
    name: string
    count: number
  }[]
}
type FetchTopNTopicsOfLegislatorsParams = {
  legislatorIds?: number[]
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
  take?: number
}
export const fetchTopNTopicsOfLegislators = async ({
  legislatorIds,
  legislativeMeetingId,
  legislativeMeetingSessionIds = [],
  take = 5,
}: FetchTopNTopicsOfLegislatorsParams): Promise<TopNTopicFromRes[]> => {
  if (!legislatorIds || legislatorIds.length === 0) {
    return []
  }

  const query = `
    query TopNTopicsOfLegislators($legislatorIds: [Int!]!, $meetingId: Int!, $take: Int, $sessionIds: [Int]) {
      topNTopicsOfLegislators(legislatorIds: $legislatorIds, meetingId: $meetingId, take: $take, sessionIds: $sessionIds) {
        id
        topics {
          count
          slug
          name
        }
      }
    }
  `
  const variables = {
    legislatorIds,
    meetingId: legislativeMeetingId,
    sessionIds: legislativeMeetingSessionIds,
    take,
  }
  const url = process.env.NEXT_PUBLIC_API_URL as string
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) {
    throw new Error(
      `Failed to fetch top ${take} topics of legislator id: ${legislatorIds}. meetingId: ${legislativeMeetingId}, sessionIds: ${legislativeMeetingSessionIds}`
    )
  }
  const data = await res.json()
  return data?.data?.topNTopicsOfLegislators || []
}

/* fetchLegislatorsOfATopic
 *   fetch legislators of given topic and sort by speeches count desc
 */
export type LegislatorForFilter = {
  slug: string
  name: string
  imageLink?: string
  image?: { imageFile: { url: string } }
  count: number
}
export const fetchLegislatorsOfATopic = async (topicSlug: string) => {
  const url = process.env.NEXT_PUBLIC_API_URL as string
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query GetLegislatorsWithSpeechCount($where: SpeechWhereInput!) {
          speeches(where: $where) {
            legislativeYuanMember {
              legislator {
                slug
                name
                imageLink
                image {
                  imageFile {
                    url
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        where: {
          topics: {
            some: {
              slug: {
                equals: topicSlug,
              },
            },
          },
        },
      },
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch legislators of a topic: ${topicSlug}`)
  }
  const data = await res.json()

  // group by legislator & sort with speech counts
  const speeches = data?.data?.speeches || []
  const legislatorCounts: { [key: string]: LegislatorForFilter } =
    speeches.reduce((acc, speech) => {
      const legislator = speech.legislativeYuanMember?.legislator
      if (!legislator) return acc

      const slug = legislator.slug
      if (!acc[slug]) {
        acc[slug] = {
          ...legislator,
          avatar: getImageLink(legislator),
          count: 0,
        }
      }
      acc[slug].count++
      return acc
    }, {})
  const legislatorOrderBySpeechCount =
    Object.values(legislatorCounts).sort(sortByCountDesc)

  return legislatorOrderBySpeechCount
}

export default fetchLegislatorsOfATopic
