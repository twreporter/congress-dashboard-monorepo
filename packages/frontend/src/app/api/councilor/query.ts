import keystoneFetch from '@/app/api/_graphql/keystone'
// type
import type { CouncilorForIndex } from '@/components/council-dashboard/type'

type FetchCouncilorsParams = {
  councilMeetingId: number
  partyIds?: number[]
  constituencies?: number[]
}

const fetchCouncilors = async ({
  councilMeetingId,
  partyIds,
  constituencies,
}: FetchCouncilorsParams): Promise<CouncilorForIndex[]> => {
  const query = `
    query CouncilMembers($where: CouncilMemberWhereInput!) {
      councilMembers(where: $where) {
        id
        councilor {
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
  const where: Record<string, unknown> = {
    councilMeeting: {
      id: {
        equals: councilMeetingId,
      },
    },
  }

  if (partyIds && partyIds.length > 0) {
    where.party = {
      id: {
        in: partyIds,
      },
    }
  }

  if (constituencies && constituencies.length > 0) {
    where.constituency = {
      in: constituencies,
    }
  }

  const variables = { where }
  const data = await keystoneFetch<{ councilMembers: CouncilorForIndex[] }>(
    JSON.stringify({ query, variables }),
    false
  )

  return data?.data?.councilMembers || []
}

export default fetchCouncilors
