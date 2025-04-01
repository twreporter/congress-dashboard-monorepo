import useSWR from 'swr'

export type LegislativeMeeting = {
  id: number
  term: number
}

export type LegislativeMeetingSession = {
  id: number
  term: number
  startTime: string
  endTime: string
}

const fetchLegislativeMeeting = async (url: string) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query Query {
          legislativeMeetings {
            id
            term
          }
        }
      `,
    }),
  })
  const data = await res.json()
  return data
}
export const useLegislativeMeeting = () => {
  const url = process.env.NEXT_PUBLIC_API_URL as string
  const { data, isLoading, error } = useSWR(url, fetchLegislativeMeeting)
  return {
    legislativeMeeting: data?.data?.legislativeMeetings || [],
    isLoading,
    error,
  }
}

const fetchLegislativeMeetingSession = async ([url, legislativeMeetingTerm]: [
  string,
  string
]) => {
  const where = {
    legislativeMeeting: {
      term: {
        equals: Number(legislativeMeetingTerm),
      },
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query LegislativeMeetingSessions($where: LegislativeMeetingSessionWhereInput!) {
          legislativeMeetingSessions(where: $where) {
            id
            term
            startTime
            endTime
          }
        }
      `,
      variables: {
        where,
      },
    }),
  })
  const data = await res.json()
  return data
}

export const useLegislativeMeetingSession = (
  legislativeMeetingTerm: string
) => {
  const url = process.env.NEXT_PUBLIC_API_URL as string
  const { data, isLoading, error } = useSWR(
    [url, legislativeMeetingTerm],
    fetchLegislativeMeetingSession
  )
  return {
    legislativeMeetingSessions: data?.data?.legislativeMeetingSessions || [],
    isLoading,
    error,
  }
}
