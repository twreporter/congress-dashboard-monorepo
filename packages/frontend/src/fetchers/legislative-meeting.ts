'use client'
import useSWR from 'swr'

import type {
  LegislativeMeeting,
  LegislativeMeetingSession,
} from '@/fetchers/server/legislative-meeting'

const apiBase = process.env.NEXT_PUBLIC_API_URL as string
const fetchLegislativeMeetingByLegislator = async (
  slug: string
): Promise<LegislativeMeeting[]> => {
  if (!slug) {
    return []
  }
  const url = `${apiBase}legislator/${encodeURIComponent(slug)}/meeting`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return data?.data || []
}

const fetchLegislativeMeeting = async (): Promise<LegislativeMeeting[]> => {
  const url = `${apiBase}/legislative-meeting`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return data?.data
}

const fetchLegislativeMeetingSession = async (
  legislativeMeetingTerm: string
): Promise<LegislativeMeetingSession[]> => {
  if (!legislativeMeetingTerm) {
    return []
  }

  const url = `${apiBase}/legislative-meeting/${encodeURIComponent(
    legislativeMeetingTerm
  )}/session`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return data?.data
}

export const useLegislativeMeetingByLegislator = (slug: string) => {
  const { data, isLoading, error } = useSWR(['legislativeMeetings', slug], () =>
    fetchLegislativeMeetingByLegislator(slug)
  )
  return {
    legislativeMeetings: data || [],
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
    legislativeMeetings: data || [],
    isLoading,
    error,
  }
}

export const useLegislativeMeetingSession = (
  legislativeMeetingTerm?: string
) => {
  const shouldFetch =
    typeof legislativeMeetingTerm === 'string' && legislativeMeetingTerm !== ''

  const { data, isLoading, error } = useSWR(
    shouldFetch ? ['legislativeMeetingSessions', legislativeMeetingTerm] : null,
    () => fetchLegislativeMeetingSession(legislativeMeetingTerm!)
  )
  return {
    legislativeMeetingSessions: data || [],
    isLoading,
    error,
  }
}
