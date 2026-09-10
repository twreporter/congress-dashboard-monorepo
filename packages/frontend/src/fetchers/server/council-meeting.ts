import { keystoneFetch } from '@/app/api/_graphql/keystone'
// type
import type { CouncilDistrict } from '@/types/council'
import type {
  CouncilMeetingFromRes,
  CouncilMeeting,
} from '@/types/council-meeting'
// lodash
import { get } from 'lodash'
const _ = {
  get,
}

/**
 * fetchCouncilMeetingsOfACity
 *  fetch council meetings with given city
 */
type FetchCouncilMeetingsOfACityParams = {
  city: CouncilDistrict
}
export const fetchCouncilMeetingsOfACity = async ({
  city,
}: FetchCouncilMeetingsOfACityParams): Promise<CouncilMeeting[]> => {
  const where = {
    city: {
      equals: city,
    },
  }
  const orderBy = [{ term: 'desc' }]
  const query = `
    query CouncilMeetings($where: CouncilMeetingWhereInput!, $orderBy: [CouncilMeetingOrderByInput!]!) {
      councilMeetings(where: $where, orderBy: $orderBy) {
        id
        term
      }
    }
  `
  const variables = { where, orderBy }
  try {
    const data = await keystoneFetch<{
      councilMeetings: CouncilMeetingFromRes[]
    }>(JSON.stringify({ query, variables }), false)
    const councilMeetingsFromRes = _.get(data, 'data.councilMeetings', [])
    return councilMeetingsFromRes.map((meeting) => ({
      id: meeting.id,
      term: meeting.term,
      city,
    }))
  } catch (err) {
    throw new Error(
      `Failed to fetch council meetings of city ${city}, err: ${err}`
    )
  }
}

/** fetchLatestCouncilMeetingOfACity
 *  fetch latest term of council meeting with given city
 */
type FetchLatestCouncilMeetingOfACityParams = {
  city: CouncilDistrict
}
export const fetchLatestCouncilMeetingOfACity = async ({
  city,
}: FetchLatestCouncilMeetingOfACityParams): Promise<
  CouncilMeeting | undefined
> => {
  const where = {
    city: {
      equals: city,
    },
  }
  const orderBy = [{ term: 'desc' }]
  const query = `
    query CouncilMeeting($where: CouncilMeetingWhereInput!, $orderBy: [CouncilMeetingOrderByInput!]!, $take: Int) {
      councilMeetings(where: $where, orderBy: $orderBy, take: $take) {
        id
        term
      }
    }
  `
  const variables = { where, orderBy, take: 1 }
  try {
    const data = await keystoneFetch<{
      councilMeetings: CouncilMeetingFromRes[]
    }>(JSON.stringify({ query, variables }), false)
    const latestCouncilMeeting = _.get(data, 'data.councilMeetings[0]')
    if (!latestCouncilMeeting) return

    return {
      id: latestCouncilMeeting.id,
      term: latestCouncilMeeting.term,
      city,
    }
  } catch (err) {
    throw new Error(
      `Failed to fetch latest council meeting of city ${city}, err: ${err}`
    )
  }
}
