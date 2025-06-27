'use client'

// utils
import { getImageLink, sortByCountDesc } from '@/fetchers/utils'
// @twreporter
import {
  MemberType,
  Constituency,
} from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'
// lodash
import { isEmpty, filter, includes } from 'lodash'
const _ = {
  isEmpty,
  filter,
  includes,
}

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
  type?: MemberType
  constituency?: Constituency
  tootip?: string
  note?: string
}[]
type FetchLegislatorsParams = {
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
  partyIds?: number[]
  constituencies?: string[]
  committeeSlugs?: string[]
}
export const fetchLegislators = async ({
  legislativeMeetingId,
  legislativeMeetingSessionIds,
  partyIds,
  constituencies,
  committeeSlugs,
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
        type
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
    AND: [
      {
        legislativeMeeting: {
          id: {
            equals: legislativeMeetingId,
          },
        },
      },
    ],
  }
  if (partyIds && partyIds.length > 0) {
    where.AND[0]['party'] = {
      id: {
        in: partyIds,
      },
    }
  }
  if (constituencies && constituencies.length > 0) {
    const typeFilter = _.filter(constituencies, (value) => {
      return _.includes(
        [
          MemberType.NationwideAndOverseas,
          MemberType.HighlandAboriginal,
          MemberType.LowlandAboriginal,
        ],
        value
      )
    })
    const cityFilter = _.filter(constituencies, (value) => {
      return !_.includes(
        [
          MemberType.NationwideAndOverseas,
          MemberType.HighlandAboriginal,
          MemberType.LowlandAboriginal,
        ],
        value
      )
    })
    const hasTypeFilter = typeFilter && typeFilter.length > 0
    const hasCityFilter = cityFilter && cityFilter.length > 0
    const needOr = hasTypeFilter && hasCityFilter
    if (needOr) {
      where['OR'] = [
        {
          type: {
            in: typeFilter,
          },
        },
        {
          city: {
            in: cityFilter,
          },
        },
      ]
    } else {
      if (hasTypeFilter) {
        where.AND[0]['type'] = {
          in: typeFilter,
        }
      }
      if (hasCityFilter) {
        where.AND[0]['city'] = {
          in: cityFilter,
        }
      }
    }
  }
  if (committeeSlugs && committeeSlugs.length > 0) {
    const sessionAndCommitteeWhere = {
      some: {
        committee: {
          some: {
            slug: {
              in: committeeSlugs,
            },
          },
        },
      },
    }
    if (
      legislativeMeetingSessionIds &&
      legislativeMeetingSessionIds.length > 0
    ) {
      sessionAndCommitteeWhere.some['legislativeMeetingSession'] = {
        id: {
          in: legislativeMeetingSessionIds,
        },
      }
    }
    where.AND[0]['sessionAndCommittee'] = sessionAndCommitteeWhere
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
export type TopNTopicFromRes = {
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
  id: number
  slug: string
  name: string
  imageLink?: string
  image?: { imageFile: { url: string } }
  count: number
}

type FetchLegislatorsOfATopicParams = {
  slug: string
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
}

export const fetchLegislatorsOfATopic = async ({
  slug,
  legislativeMeetingId,
  legislativeMeetingSessionIds,
}: FetchLegislatorsOfATopicParams) => {
  const url = process.env.NEXT_PUBLIC_API_URL as string
  const query = `
    query GetLegislatorsWithSpeechCount($where: SpeechWhereInput!) {
      speeches(where: $where) {
        legislativeYuanMember {
          id
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
  `
  const variables = {
    where: {
      topics: {
        some: {
          slug: {
            equals: slug,
          },
        },
      },
      legislativeMeeting: {
        id: {
          equals: legislativeMeetingId,
        },
      },
    },
  }
  if (legislativeMeetingSessionIds && legislativeMeetingSessionIds.length > 0) {
    variables.where['legislativeMeetingSession'] = {
      id: {
        in: legislativeMeetingSessionIds,
      },
    }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch legislators of a topic: ${slug}`)
  }
  const data = await res.json()

  // group by legislator & sort with speech counts
  const speeches = data?.data?.speeches || []
  const legislatorCounts: { [key: string]: LegislatorForFilter } =
    speeches.reduce((acc, speech) => {
      const legislator = speech.legislativeYuanMember?.legislator
      const id = speech.legislativeYuanMember?.id
      if (!legislator) return acc

      const { slug, ...rest } = legislator
      if (!acc[slug]) {
        acc[slug] = {
          ...rest,
          id: Number(id),
          slug,
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

/* fetchLegislatorsOfATopic
 *   fetch legislators of given topic and sort by speeches count desc
 */
type FetchTopNLegislatorsOfATopicParams = {
  topicSlug: string
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
  partyIds?: number[]
  constituencies?: string[]
  committeeSlugs?: string[]
  take?: number
}
export const fetchTopNLegislatorsOfATopic = async ({
  topicSlug,
  legislativeMeetingId,
  legislativeMeetingSessionIds,
  partyIds,
  constituencies,
  committeeSlugs,
  take = 5,
}: FetchTopNLegislatorsOfATopicParams): Promise<
  LegislatorWithSpeechCount[]
> => {
  const url = process.env.NEXT_PUBLIC_API_URL as string
  const query = `
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
  `
  const where = {
    topics: {
      some: {
        slug: {
          equals: topicSlug,
        },
      },
    },
    legislativeMeeting: {
      id: {
        equals: legislativeMeetingId,
      },
    },
  }
  const legislativeMemberWhere = {}
  if (partyIds && partyIds.length > 0) {
    legislativeMemberWhere['party'] = {
      id: {
        in: partyIds,
      },
    }
  }
  if (constituencies && constituencies.length > 0) {
    legislativeMemberWhere['constituency'] = {
      in: constituencies,
    }
  }
  if (committeeSlugs && committeeSlugs.length > 0) {
    const sessionAndCommitteeWhere = {
      some: {
        committee: {
          some: {
            slug: {
              in: committeeSlugs,
            },
          },
        },
      },
    }
    if (
      legislativeMeetingSessionIds &&
      legislativeMeetingSessionIds.length > 0
    ) {
      sessionAndCommitteeWhere.some['legislativeMeetingSession'] = {
        id: {
          in: legislativeMeetingSessionIds,
        },
      }
    }
    legislativeMemberWhere['sessionAndCommittee'] = sessionAndCommitteeWhere
  }
  if (!_.isEmpty(legislativeMemberWhere)) {
    where['legislativeYuanMember'] = legislativeMemberWhere
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { where } }),
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

  const topLegislators = Object.values(legislatorCounts)
    .sort(sortByCountDesc)
    .slice(0, take)

  return topLegislators || []
}
