'use client'
import useSWR from 'swr'

import {
  fetchLegislativeMeeting,
  fetchLegislativeMeetingSession,
} from '@/fetchers/server/legislative-meeting'

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
