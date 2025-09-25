import keystoneFetch from '@/app/api/_graphql/keystone'

type SpeechFromRes = {
  date: string
  slug: string
  summary: string
  title: string
}

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
        summary
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
