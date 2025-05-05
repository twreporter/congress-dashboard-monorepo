import useSWR from 'swr'

export type speechData = {
  slug: string
  title: string
  date: string
  summary: string
}

type FetchSpeechesParams = {
  topicSlug: string
  legislatorSlug: string
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
}

const fetchSpeechesOfALegislatorInATopic = async ({
  topicSlug,
  legislatorSlug,
  legislativeMeetingId,
  legislativeMeetingSessionIds,
}: FetchSpeechesParams): Promise<speechData[]> => {
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
            equals: legislatorSlug,
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
  const url = process.env.NEXT_PUBLIC_API_URL as string
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch speeches. topicSlug: ${topicSlug}, legislatorSlug: ${legislatorSlug}, meetingId: ${legislativeMeetingId}, sessionIds: ${legislativeMeetingSessionIds}`
    )
  }
  const data = await res.json()
  return data?.data?.speeches || []
}
const useSpeech = (params?: FetchSpeechesParams) => {
  const { data, isLoading, error } = useSWR(
    params ? params : null,
    fetchSpeechesOfALegislatorInATopic
  )
  return {
    speeches: data,
    isLoading,
    error,
  }
}

export default useSpeech
