import keystoneFetch from '@/app/api/_graphql/keystone'

type LegislativeMeetingSessionFromRes = {
  id: number
  term: number
  startTime: string
  endTime: string
}

type FetchLegislativeMeetingSessionsParams = {
  legislativeMeetingTerm: string
}

const fetchLegislativeMeetingSessions = async ({
  legislativeMeetingTerm,
}: FetchLegislativeMeetingSessionsParams) => {
  const query = `
    query LegislativeMeetingSessions($where: LegislativeMeetingSessionWhereInput!, $orderBy: [LegislativeMeetingSessionOrderByInput!]!) {
      legislativeMeetingSessions(where: $where, orderBy: $orderBy) {
        id
        term
        startTime
        endTime
      }
    }
  `
  const variables = {
    where: {
      legislativeMeeting: {
        term: {
          equals: Number(legislativeMeetingTerm),
        },
      },
    },
    orderBy: [{ term: 'asc' }],
  }
  const data = await keystoneFetch<{
    legislativeMeetingSessions: LegislativeMeetingSessionFromRes[]
  }>(JSON.stringify({ query, variables }), false)

  return data?.data?.legislativeMeetingSessions || []
}

export default fetchLegislativeMeetingSessions
