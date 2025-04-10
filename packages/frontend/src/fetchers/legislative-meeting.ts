'use client'
import useSWR from 'swr'

import type {
  LegislativeMeeting,
  LegislativeMeetingSession,
} from '@/fetchers/server/legislative-meeting'

const API_URL = process.env.NEXT_PUBLIC_API_URL as string
const fetchLegislativeMeeting = async (): Promise<LegislativeMeeting[]> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query Query {
          legislativeMeetings(orderBy: [{ term: desc }]) {
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

const fetchLegislativeMeetingSession = async (
  legislativeMeetingTerm: string
): Promise<LegislativeMeetingSession[]> => {
  const where = {
    legislativeMeeting: {
      term: {
        equals: Number(legislativeMeetingTerm),
      },
    },
  }

  const orderBy = [{ term: 'asc' }]

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query LegislativeMeetingSessions($where: LegislativeMeetingSessionWhereInput!, $orderBy: [LegislativeMeetingSessionOrderByInput!]!) {
          legislativeMeetingSessions(where: $where, orderBy: $orderBy) {
            id
            term
            startTime
            endTime
          }
        }
      `,
      variables: {
        where,
        orderBy,
      },
    }),
  })
  const data = await res.json()
  return data?.data?.legislativeMeetingSessions
}

export const useLegislativeMeeting = () => {
  const { data, isLoading, error } = useSWR(
    'legislativeMeetings',
    fetchLegislativeMeeting
  )
  return {
    legislativeMeeting: data || [],
    isLoading,
    error,
  }
}

export const useLegislativeMeetingSession = (
  legislativeMeetingTerm: string
) => {
  const { data, isLoading, error } = useSWR(
    ['legislativeMeetingSessions', legislativeMeetingTerm],
    () => fetchLegislativeMeetingSession(legislativeMeetingTerm)
  )
  return {
    legislativeMeetingSessions: data || [],
    isLoading,
    error,
  }
}
