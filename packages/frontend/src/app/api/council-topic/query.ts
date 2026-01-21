import keystoneFetch from '@/app/api/_graphql/keystone'
// type
import type { TopNCouncilTopicData } from '@/types/council-topic'

type FetchTopNCouncilTopicsParams = {
  councilMeetingId: number
  partyIds?: number[]
  take?: number
  skip?: number
}

type CouncilTopicFromGraphQL = TopNCouncilTopicData

const fetchTopNCouncilTopics = async ({
  councilMeetingId,
  partyIds = [],
  take = 10,
  skip = 0,
}: FetchTopNCouncilTopicsParams): Promise<TopNCouncilTopicData[]> => {
  const query = `
    query CouncilTopicsOrderByBillCount($meetingId: Int!, $take: Int, $skip: Int, $partyIds: [Int]) {
      councilTopicsOrderByBillCount(meetingId: $meetingId, take: $take, skip: $skip, partyIds: $partyIds) {
        councilorCount
        slug
        billCount
        title
        councilors {
          id
          name
          imageLink
          slug
          party
          image {
            imageFile {
              url
            }
          }
        }
      }
    }
  `
  const variables = {
    take,
    skip,
    meetingId: councilMeetingId,
    partyIds: partyIds.length > 0 ? partyIds : undefined,
  }
  const data = await keystoneFetch<{
    councilTopicsOrderByBillCount: CouncilTopicFromGraphQL[]
  }>(JSON.stringify({ query, variables }), false)

  const topics = data?.data?.councilTopicsOrderByBillCount || []
  return topics
}

export default fetchTopNCouncilTopics
