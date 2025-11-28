import keystoneFetch from '@/app/api/_graphql/keystone'
// type
import type { LegislativeMeeting } from '@/types/legislative-meeting'

type LegislativeMeetingFromRes = LegislativeMeeting

const fetchLegislativeMeetings = async () => {
  const query = `
    query LegislativeMeetingsOrderDesc {
      legislativeMeetings(orderBy: [{ term: desc }]) {
        id
        term
      }
    }
  `
  const data = await keystoneFetch<{
    legislativeMeetings: LegislativeMeetingFromRes[]
  }>(JSON.stringify({ query }), false)
  return data?.data?.legislativeMeetings || []
}

export default fetchLegislativeMeetings
