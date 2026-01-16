import keystoneFetch from '@/app/api/_graphql/keystone'
// type
import type { TopNTopicForCouncilors } from '@/types/council-topic'

type TopicFromRes = TopNTopicForCouncilors

type FetchTopNTopicsOfCouncilMembersParams = {
  councilMemberIds?: number[]
  councilMeetingId: number
  take?: number
}

const fetchTopNTopics = async ({
  councilMemberIds,
  councilMeetingId,
  take = 5,
}: FetchTopNTopicsOfCouncilMembersParams) => {
  const query = `
    query TopNTopicsOfCouncilMembers($councilMemberIds: [Int!]!, $councilMeetingId: Int!, $take: Int) {
      topNTopicsOfCouncilMembers(councilMemberIds: $councilMemberIds, councilMeetingId: $councilMeetingId, take: $take) {
        id
        topics {
          slug
          name
          count
        }
      }
    }
  `
  const variables = {
    councilMemberIds,
    councilMeetingId,
    take,
  }
  const data = await keystoneFetch<{
    topNTopicsOfCouncilMembers: TopicFromRes[]
  }>(JSON.stringify({ query, variables }), false)

  return data?.data?.topNTopicsOfCouncilMembers || []
}

export default fetchTopNTopics
