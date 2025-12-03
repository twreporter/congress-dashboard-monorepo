import { keystoneFetch } from '@/app/api/_graphql/keystone'
// type
import type { LegislativeMeeting } from '@/types/legislative-meeting'
import type { LegislativeMeetingSession } from '@/types/legislative-meeting-session'

/* fetchLegislativeMeeting
 *   fetch legislative meeing order by term desc
 */
export const fetchLegislativeMeeting = async (): Promise<
  LegislativeMeeting[]
> => {
  try {
    const data = await keystoneFetch<{
      legislativeMeetings: LegislativeMeeting[]
    }>(
      JSON.stringify({
        query: `
          query LegislativeMeetings {
            legislativeMeetings(orderBy: [{ term: desc }]) {
              id
              term
            }
          }
        `,
      }),
      false
    )
    return data?.data?.legislativeMeetings || []
  } catch (err) {
    throw new Error(`Failed to fetch legislative meetings. err: ${err}`)
  }
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

  try {
    const data = await keystoneFetch<{
      legislativeMeetingSessions: LegislativeMeetingSession[]
    }>(JSON.stringify({ query, variables }), false)
    return data?.data?.legislativeMeetingSessions || []
  } catch (err) {
    throw new Error(`Failed to fetch meeting sessions. err: ${err}`)
  }
}
