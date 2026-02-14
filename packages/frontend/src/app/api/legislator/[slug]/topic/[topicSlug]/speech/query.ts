import keystoneFetch from '@/app/api/_graphql/keystone'
// type
import type { SpeechDataForSidebar } from '@/types/speech'

type SpeechFromRes = SpeechDataForSidebar

type FetchSpeechesOfALegislatorInATopicParams = {
  slug: string
  topicSlug: string
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
}

const fetchSpeechesOfALegislatorInATopic = async ({
  slug,
  topicSlug,
  legislativeMeetingId,
  legislativeMeetingSessionIds,
}: FetchSpeechesOfALegislatorInATopicParams) => {
  const query = `
    query Speeches($where: SpeechWhereInput!, $orderBy: [SpeechOrderByInput!]!) {
      speeches(where: $where, orderBy: $orderBy) {
        date
        slug
        summaryFallback
        title
      }
    }
  `
  const variables = {
    where: {
      topics: {
        some: {
          slug: {
            equals: topicSlug,
          },
        },
      },
      legislativeMeeting: {
        id: {
          equals: legislativeMeetingId,
        },
      },
      legislativeYuanMember: {
        legislator: {
          slug: {
            equals: slug,
          },
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  }
  if (legislativeMeetingSessionIds && legislativeMeetingSessionIds.length > 0) {
    variables.where['legislativeMeetingSession'] = {
      id: {
        in: legislativeMeetingSessionIds,
      },
    }
  }
  const data = await keystoneFetch<{ speeches: SpeechFromRes[] }>(
    JSON.stringify({ query, variables }),
    false
  )

  const topics = data?.data?.speeches || []
  return topics
}

export default fetchSpeechesOfALegislatorInATopic
