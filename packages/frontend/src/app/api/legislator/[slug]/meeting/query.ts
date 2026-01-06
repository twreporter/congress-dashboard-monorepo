import keystoneFetch from '@/app/api/_graphql/keystone'
// type
import type { LegislativeMeeting } from '@/types/legislative-meeting'

type DataFromRes = {
  legislativeMeeting: LegislativeMeeting
}

type FetchLegislatorMeetingsParams = {
  slug: string
}

const fetchLegislatorMeetings = async ({
  slug,
}: FetchLegislatorMeetingsParams) => {
  const query = `
    query LegislativeYuanMembers($where: LegislativeYuanMemberWhereInput!) {
      legislativeYuanMembers(where: $where) {
        legislativeMeeting {
          id
          term
        }
      }
    }
  `
  const variables = {
    where: {
      legislator: {
        slug: {
          equals: slug,
        },
      },
    },
  }
  const data = await keystoneFetch<{ legislativeYuanMembers: DataFromRes[] }>(
    JSON.stringify({ query, variables }),
    false
  )

  const legislativeYuanMembers = data?.data?.legislativeYuanMembers || []
  return legislativeYuanMembers
    .map((m) => ({
      term: m.legislativeMeeting.term,
      id: m.legislativeMeeting.id,
    }))
    .sort((a, b) => b.term - a.term)
}

export default fetchLegislatorMeetings
