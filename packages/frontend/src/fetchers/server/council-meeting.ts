import { keystoneFetch } from '@/app/api/_graphql/keystone'
// type
import type { CouncilDistrict } from '@/types/council'
// lodash
import { get } from 'lodash'
const _ = {
  get,
}

/** FetchLatestMeetingTermOfACityParams
 *  fetch latest term of council meeting with given city
 */
type MeetingTerm = {
  term: number
}
type FetchLatestMeetingTermOfACityParams = {
  city: CouncilDistrict
}
export const fetchLatestMeetingTermOfACity = async ({
  city,
}: FetchLatestMeetingTermOfACityParams): Promise<number> => {
  const where = {
    city: {
      equals: city,
    },
  }
  const orderBy = [{ term: 'desc' }]
  const query = `
    query CouncilMeetings($where: CouncilMeetingWhereInput!, $orderBy: [CouncilMeetingOrderByInput!]!, $take: Int) {
      councilMeetings(where: $where, orderBy: $orderBy, take: $take) {
        term
      }
    }
  `
  const variables = { where, orderBy, take: 1 }
  try {
    const data = await keystoneFetch<{
      councilMeetings: MeetingTerm[]
    }>(JSON.stringify({ query, variables }), false)
    return _.get(data, 'data.councilMeetings[0].term', -1)
  } catch (err) {
    throw new Error(
      `Failed to fetch council meeting term of city ${city}, err: ${err}`
    )
  }
}
