import keystoneFetch from '@/app/api/_graphql/keystone'
// type
import type { LegislatorForIndex } from '@/types/legislator'
// @twreporter
import {
  MemberType,
} from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'
// lodash
import { filter, includes } from 'lodash'
const _ = {
  filter,
  includes,
}

type FetchLegislatorsParams = {
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
  partyIds?: number[]
  constituencies?: string[]
  committeeSlugs?: string[]
}

const fetchLegislators = async ({
  legislativeMeetingId,
  legislativeMeetingSessionIds,
  partyIds,
  constituencies,
  committeeSlugs,
}: FetchLegislatorsParams): Promise<LegislatorForIndex[]> => {
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

  const data = await keystoneFetch<{
    legislativeYuanMembers: LegislatorForIndex[]
  }>(JSON.stringify({ query, variables: { where } }), false)

  return data?.data?.legislativeYuanMembers || []
}

export default fetchLegislators
