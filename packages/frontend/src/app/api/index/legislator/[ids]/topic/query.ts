import keystoneFetch from '@/app/api/_graphql/keystone'

type TopicFromRes = {
  id: number
  topics?: {
    id: number
    slug: string
    name: string
    count: number
  }[]
}

type FetchTopNTopicsOfLegislatorsParams = {
  legislatorIds?: number[]
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
  take?: number
}

const fetchTopNTopics = async ({
  legislatorIds,
  legislativeMeetingId,
  legislativeMeetingSessionIds = [],
  take = 5,
}: FetchTopNTopicsOfLegislatorsParams) => {
  const query = `
    query TopNTopicsOfLegislators($legislatorIds: [Int!]!, $meetingId: Int!, $take: Int, $sessionIds: [Int]) {
      topNTopicsOfLegislators(legislatorIds: $legislatorIds, meetingId: $meetingId, take: $take, sessionIds: $sessionIds) {
        id
        topics {
          count
          slug
          name
        }
      }
    }
  `
  const variables = {
    legislatorIds,
    meetingId: legislativeMeetingId,
    sessionIds: legislativeMeetingSessionIds,
    take,
  }
  const data = await keystoneFetch<{ topNTopicsOfLegislators: TopicFromRes[] }>(
    JSON.stringify({ query, variables }),
    false
  )

  return data?.data?.topNTopicsOfLegislators || []
}

export default fetchTopNTopics
