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

const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export const fetchLegislativeMeeting = async (): Promise<
  LegislativeMeeting[]
> => {
  const res = await fetch(API_URL, {
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
  return data?.data?.legislativeMeetings
}

export const fetchLegislativeMeetingSession = async (
  legislativeMeetingTerm: string
): Promise<LegislativeMeetingSession[]> => {
  const where = {
    legislativeMeeting: {
      term: {
        equals: Number(legislativeMeetingTerm),
      },
    },
  }

  const res = await fetch(API_URL, {
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
  return data?.data?.legislativeMeetingSessions
}
