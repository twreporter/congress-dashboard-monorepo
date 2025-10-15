import keystoneFetch from '@/app/api/_graphql/keystone'
// utils
import { getImageLink, sortByCountDesc } from '@/fetchers/utils'
// enum
import { FilterKey } from '@/app/api/topic/[slug]/legislator/enum-constant'
// lodash
import { isEmpty } from 'lodash'
const _ = {
  isEmpty,
}

type LegislatorWithSpeechCount = {
  id: number
  slug: string
  name: string
  avatar: string
  partyAvatar: string
  count: number
}

type PartyData = {
  id: number
  slug: string
  name: string
  imageLink?: string
  image?: { imageFile: { url: string } }
}

type SpeechFromRes = {
  legislativeYuanMember: {
    id: number
    legislator: {
      name: string
      slug: string
      image?: {
        imageFile: {
          url: string
        }
      }
      imageLink?: string
    }
    party: PartyData
  }
}

type FetchTopNTopicsParams = {
  filterKey: FilterKey
  slug: string
  legislativeMeeting: number
  legislativeMeetingSessions?: number[]
  partyIds?: number[]
  constituencies?: string[]
  committeeSlugs?: string[]
  excludeLegislatorSlug?: string
  top?: number
}

const fetchTopNLegislatorsOfATopic = async ({
  filterKey,
  slug,
  legislativeMeeting,
  legislativeMeetingSessions,
  partyIds,
  constituencies,
  committeeSlugs,
  excludeLegislatorSlug,
  top,
}: FetchTopNTopicsParams): Promise<LegislatorWithSpeechCount[]> => {
  const query = `
    query GetTopLegislatorsBySpeechCount($where: SpeechWhereInput!) {
      speeches(where: $where) {
        legislativeYuanMember {
          id
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
        [filterKey]: {
          equals: legislativeMeeting,
        },
      },
    },
  }
  if (legislativeMeetingSessions && legislativeMeetingSessions.length > 0) {
    variables.where['legislativeMeetingSession'] = {
      [filterKey]: {
        in: legislativeMeetingSessions,
      },
    }
  }
  if (excludeLegislatorSlug) {
    variables.where['legislativeYuanMember'] = {
      legislator: {
        slug: {
          not: {
            equals: excludeLegislatorSlug,
          },
        },
      },
    }
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
      filterKey === FilterKey.ID &&
      legislativeMeetingSessions &&
      legislativeMeetingSessions.length > 0
    ) {
      sessionAndCommitteeWhere.some['legislativeMeetingSession'] = {
        id: {
          in: legislativeMeetingSessions,
        },
      }
    }
    legislativeMemberWhere['sessionAndCommittee'] = sessionAndCommitteeWhere
  }
  if (!_.isEmpty(legislativeMemberWhere)) {
    variables.where['legislativeYuanMember'] = legislativeMemberWhere
  }

  const data = await keystoneFetch<{ speeches: SpeechFromRes[] }>(
    JSON.stringify({ query, variables }),
    false
  )

  const speeches = data?.data?.speeches || []
  // Count speeches by legislator
  const legislatorCounts: Record<string, LegislatorWithSpeechCount> =
    speeches.reduce((acc, speech) => {
      const legislator = speech.legislativeYuanMember?.legislator
      if (!legislator) return acc

      const slug = legislator.slug
      if (!acc[slug]) {
        acc[slug] = {
          ...legislator,
          id: speech.legislativeYuanMember.id,
          slug,
          avatar: getImageLink(legislator),
          partyAvatar: getImageLink(speech.legislativeYuanMember.party),
          count: 0,
        }
      }
      acc[slug].count++
      return acc
    }, {})

  // Convert to array, sort by count, and take top 5
  const legislatorsOrderByCount =
    Object.values(legislatorCounts).sort(sortByCountDesc)
  return top ? legislatorsOrderByCount.slice(0, top) : legislatorsOrderByCount
}

export default fetchTopNLegislatorsOfATopic
