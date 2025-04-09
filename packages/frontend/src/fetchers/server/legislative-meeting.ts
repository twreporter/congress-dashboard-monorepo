import { keystoneFetch } from '@/app/api/graphql/keystone'

/* fetchLegislativeMeeting
 *   fetch legislative meeing order by term desc
 */
export type LegislativeMeeting = {
  id: number
  term: number
}

export type LegislativeMeetingSession = {
  id: number
  term: number
  startTime: string
  endTime: string
}

export const fetchLegislativeMeeting = async (): Promise<
  LegislativeMeeting[]
> => {
  const data = await keystoneFetch<{
    legislativeMeetings: LegislativeMeeting[]
  }>(
    JSON.stringify({
      query: `
        query Query {
          legislativeMeetings(orderBy: [{ term: desc }]) {
            id
            term
          }
        }
      `,
    })
  )
  return data?.data?.legislativeMeetings || []
}

/* fetchLegislativeMeetingSession
 *   fetch legislative meeing sessions in given term & order by term asc
 */
export const fetchLegislativeMeetingSession = async (
  legislativeMeetingTerm: string
): Promise<LegislativeMeetingSession[]> => {
  const where = {
    legislativeMeeting: {
      term: {
        equals: Number(legislativeMeetingTerm),
      },
    },
  }
  const orderBy = [{ term: 'asc' }]
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
    where,
    orderBy,
  }

  const data = await keystoneFetch<{
    legislativeMeetingSessions: LegislativeMeetingSession[]
  }>(JSON.stringify({ query, variables }))
  return data?.data?.legislativeMeetingSessions || []
}
