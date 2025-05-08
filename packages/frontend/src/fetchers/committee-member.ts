import useSWR from 'swr'
// util
import { sortByCountDesc } from '@/fetchers/utils'

type CommitteeForReturn = {
  count: number
  name: string
}
type CommitteeData = {
  committee: {
    name: string
    slug: string
  }[]
  committeeCount: number
}
type StateType<T> = {
  committees: T[]
  isLoading: boolean
  error?: Error
}
type FetchCommitteeMemberParams = {
  slug: string
  legislativeMeetingId: number
}

const fetchCommitteeMember = async ({
  slug,
  legislativeMeetingId,
}: FetchCommitteeMemberParams) => {
  const url = process.env.NEXT_PUBLIC_API_URL as string
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
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch committee member. slug: ${slug}, meeting id: ${legislativeMeetingId}`
    )
  }
  const data = await res.json()
  const committee = data?.data?.committeeMembers
  if (!committee) {
    return []
  }

  type GroupedData = Record<string, CommitteeForReturn>
  const committeeGrouped: GroupedData = committee.reduce(
    (acc, { committee }: CommitteeData) => {
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
const useCommitteeMember = (
  params?: FetchCommitteeMemberParams
): StateType<CommitteeForReturn> => {
  const { data, isLoading, error } = useSWR(
    params ? params : null,
    fetchCommitteeMember
  )
  return {
    committees: data || [],
    isLoading,
    error,
  }
}

export default useCommitteeMember
