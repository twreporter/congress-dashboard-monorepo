import keystoneFetch from '@/app/api/_graphql/keystone'
// util
import { sortByCountDesc } from '@/fetchers/utils'
// type
import type { CommitteeMember } from '@/types/committee-member'

type CommitteeMemberDataFromRes = {
  committee: {
    name: string
    slug: string
  }[]
  committeeCount: number
}

type CommitteeMemberForReturn = CommitteeMember

type FetchCommitteeMemberParams = {
  slug: string
  legislativeMeetingId: number
}

const fetchCommitteeMember = async ({
  slug,
  legislativeMeetingId,
}: FetchCommitteeMemberParams) => {
  const query = `
    query CommitteeMembers($where: CommitteeMemberWhereInput!) {
      committeeMembers(where: $where) {
        committeeCount
        committee {
          name
          slug
        }
      }
    }
  `
  const variables = {
    where: {
      legislativeMeetingSession: {
        legislativeMeeting: {
          id: {
            equals: legislativeMeetingId,
          },
        },
      },
      legislativeYuanMember: {
        legislator: {
          slug: {
            equals: slug,
          },
        },
      },
    },
  }
  const data = await keystoneFetch<{
    committeeMembers: CommitteeMemberDataFromRes[]
  }>(JSON.stringify({ query, variables }), false)
  const committeeMembers = data?.data?.committeeMembers || []

  if (!committeeMembers) {
    return []
  }

  type GroupedData = Record<string, CommitteeMemberForReturn>
  const committeeGrouped: GroupedData = committeeMembers.reduce(
    (acc, { committee }: CommitteeMemberDataFromRes) => {
      if (!committee || committee.length === 0) {
        return acc
      }
      committee.forEach(({ name, slug }) => {
        if (!acc[slug]) {
          acc[slug] = {
            name,
            count: 0,
          }
        }
        acc[slug].count += 1
      })
      return acc
    },
    {}
  )
  return Object.values(committeeGrouped).sort(sortByCountDesc)
}

export default fetchCommitteeMember
