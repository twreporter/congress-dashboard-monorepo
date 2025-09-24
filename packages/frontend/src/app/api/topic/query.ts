import keystoneFetch from '@/app/api/_graphql/keystone'

type PartyData = {
  id: number
  slug: string
  name: string
  imageLink?: string
  image?: { imageFile: { url: string } }
}

type TopicFromRes = {
  title: string
  slug: string
  speechCount: number
  legislatorCount: number
  legislators: {
    id: number
    count: number
    name?: string
    slug: string
    party?: number | PartyData
    imageLink?: string
    image?: {
      imageFile: {
        url: string
      }
    }
    avatar?: string
    partyAvatar?: string
  }[]
}

type FetchTopNTopicsParams = {
  take?: number
  skip?: number
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
  partyIds?: number[]
}

const fetchTopNTopics = async ({
  take = 10,
  skip = 0,
  legislativeMeetingId,
  legislativeMeetingSessionIds = [],
  partyIds = [],
}: FetchTopNTopicsParams) => {
  const query = `
    query TopicsOrderBySpeechCount($meetingId: Int!, $take: Int, $sessionIds: [Int], $partyIds: [Int], $skip: Int) {
      topicsOrderBySpeechCount(meetingId: $meetingId, take: $take, sessionIds: $sessionIds, skip: $skip, partyIds: $partyIds) {
        legislatorCount
        slug
        speechCount
        title
        legislators {
          id
          count
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
    meetingId: Number(legislativeMeetingId),
    sessionIds: legislativeMeetingSessionIds,
    partyIds,
  }
  const data = await keystoneFetch<{
    topicsOrderBySpeechCount: TopicFromRes[]
  }>(JSON.stringify({ query, variables }), false)

  return data?.data?.topicsOrderBySpeechCount || []
}

export default fetchTopNTopics
