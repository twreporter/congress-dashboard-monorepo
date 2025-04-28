'use client'
import useSWR from 'swr'

import type {
  LegislativeMeeting,
  LegislativeMeetingSession,
} from '@/fetchers/server/legislative-meeting'

const API_URL = process.env.NEXT_PUBLIC_API_URL as string
const fetchLegislativeMeetingByLegislator = async (
  slug: string
): Promise<LegislativeMeeting> => {
  const where = {
    legislator: {
      slug: {
        equals: slug,
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
        query LegislativeYuanMembers($where: LegislativeYuanMemberWhereInput!) {
          legislativeYuanMembers(where: $where) {
            legislativeMeeting {
              id
              term
            }
          }
        }
      `,
      variables: {
        where,
      },
    }),
  })
  const data = await res.json()
  return data?.data?.legislativeYuanMembers
    .map((m) => ({
      term: m.legislativeMeeting.term,
      id: m.legislativeMeeting.id,
    }))
    .sort((a, b) => b.term - a.term)
}
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

export const useLegislativeMeetingByLegislator = (slug: string) => {
  const { data, isLoading, error } = useSWR(['legislativeMeetings', slug], () =>
    fetchLegislativeMeetingByLegislator(slug)
  )
  return {
    legislativeMeeting: data || [],
    isLoading,
    error,
  }
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
