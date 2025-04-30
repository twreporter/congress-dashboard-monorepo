import { useState, useEffect } from 'react'
// enum
import { SelectorType } from '@/components/selector'
// util
import { formatDate } from '@/utils/date-formatters'
// fetcher
import {
  useLegislativeMeeting,
  useLegislativeMeetingByLegislator,
  useLegislativeMeetingSession,
} from '@/fetchers/legislative-meeting'
// type
import type {
  FilterOption,
  FilterModalValueType,
} from '@/components/dashboard/type'
// lodash
import map from 'lodash/map'
const _ = {
  map,
}

export const useLegislativeMeetingFilters = ({
  legislatorSlug,
  currentMeetingTerm,
  currentMeetingSession,
}: {
  legislatorSlug?: string
  currentMeetingTerm: number
  currentMeetingSession: number[]
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterCount, setFilterCount] = useState(0)
  const [filterValues, setFilterValues] = useState({
    meeting: String(currentMeetingTerm),
    meetingSession: currentMeetingSession.map(String),
  })

  const allMeetingState = useLegislativeMeeting()
  const byLegislatorMeetingState = useLegislativeMeetingByLegislator(
    legislatorSlug || ''
  )
  const legislativeMeetingState = legislatorSlug
    ? byLegislatorMeetingState
    : allMeetingState

  const legislativeMeetingSessionState = useLegislativeMeetingSession(
    filterValues.meeting as string
  )

  // Auto-select 'all' if all sessions are selected
  useEffect(() => {
    if (
      !legislativeMeetingSessionState.isLoading &&
      legislativeMeetingSessionState.legislativeMeetingSessions.length > 0
    ) {
      const allSessionValues =
        legislativeMeetingSessionState.legislativeMeetingSessions.map(
          ({ term }) => term.toString()
        )

      const isAllSelected =
        allSessionValues.every((value) =>
          filterValues.meetingSession.includes(value)
        ) && filterValues.meetingSession.length >= allSessionValues.length

      if (isAllSelected && !filterValues.meetingSession.includes('all')) {
        setFilterValues((prev) => ({
          ...prev,
          meetingSession: ['all'],
        }))
      }
    }
  }, [
    filterValues.meetingSession,
    legislativeMeetingSessionState.isLoading,
    legislativeMeetingSessionState.legislativeMeetingSessions,
  ])

  // Handle selection changes - when a specific option is selected, remove 'all'
  const handleFilterValueChange = (newValues: FilterModalValueType) => {
    // When meeting term changes, reset session values
    if (newValues.meeting !== filterValues.meeting) {
      setFilterValues({
        meeting: newValues.meeting as string,
        meetingSession: ['all'],
      })
      return
    }

    // Handle meeting session changes
    if (newValues.meetingSession !== filterValues.meetingSession) {
      const newMeetingSession = [...(newValues.meetingSession as string[])]

      // If 'all' is newly selected, clear other selections
      if (
        newMeetingSession.includes('all') &&
        !filterValues.meetingSession.includes('all')
      ) {
        setFilterValues({
          ...(newValues as { meeting: string; meetingSession: string[] }),
          meetingSession: ['all'],
        })
        return
      }

      // If another option is selected while 'all' is already selected, remove 'all'
      if (newMeetingSession.includes('all') && newMeetingSession.length > 1) {
        const filteredSessions = newMeetingSession.filter(
          (val) => val !== 'all'
        )
        setFilterValues({
          ...(newValues as { meeting: string; meetingSession: string[] }),
          meetingSession: filteredSessions,
        })
        return
      }

      // Default case: just update the values
      setFilterValues(
        newValues as { meeting: string; meetingSession: string[] }
      )
    } else {
      setFilterValues(
        newValues as { meeting: string; meetingSession: string[] }
      )
    }
  }

  // Update filter count
  useEffect(() => {
    // If "all" is selected, don't count it as a filter
    if (filterValues.meetingSession.includes('all')) {
      setFilterCount(0)
    } else {
      setFilterCount(filterValues.meetingSession.length)
    }
  }, [filterValues.meetingSession])

  // Generate filter options
  const filterOptions: FilterOption[] = [
    {
      type: SelectorType.Single,
      disabled: false,
      label: '屆期',
      key: 'meeting',
      defaultValue:
        legislativeMeetingState.legislativeMeeting[0]?.term.toString(),
      isLoading: legislativeMeetingState.isLoading,
      options: _.map(
        legislativeMeetingState.legislativeMeeting,
        ({ term }: { term: number }) => ({
          label: `第 ${term} 屆`,
          value: term.toString(),
        })
      ),
    },
    {
      type: SelectorType.Multiple,
      disabled: false,
      defaultValue: ['all'],
      label: '會期',
      key: 'meetingSession',
      isLoading: legislativeMeetingSessionState.isLoading,
      options: [
        { label: '全部會期', value: 'all', isDeletable: false },
        ..._.map(
          legislativeMeetingSessionState.legislativeMeetingSessions,
          ({
            term,
            startTime,
            endTime,
          }: {
            term: number
            startTime: string
            endTime: string
          }) => ({
            label: `第 ${term} 會期(${formatDate(
              startTime,
              'YYYY/M'
            )}-${formatDate(endTime, 'YYYY/M')})`,
            value: term.toString(),
          })
        ),
      ],
    },
  ]

  return {
    isFilterOpen,
    setIsFilterOpen,
    filterCount,
    filterValues,
    handleFilterValueChange,
    legislativeMeetingState,
    legislativeMeetingSessionState,
    filterOptions,
  }
}
