'use client'

import { useEffect } from 'react'
import FilterButton from '@/components/button/filter-button'
import FilterModal from '@/components/filter-modal'
import type { FilterOption } from '@/components/dashboard/type'
import { useState } from 'react'
import { SelectorType } from '@/components/selector'
import { formatDate } from '@/utils/date-formatters'
import { useLegislativeMeeting } from '@/fetchers/legislative-meeting'
import { useLegislativeMeetingSession } from '@/fetchers/legislative-meeting'

export type LegislativeFilterValueType = {
  // NOTE: currently fixed to 'legislativeYuan' only.
  // Kept in the value shape for FilterModal schema compatibility
  department: string
  meeting: string
  meetingSession: string[]
}

export const defaultLegislativeFilterValue = {
  department: 'legislativeYuan',
  meeting: 'all',
  meetingSession: ['all'],
}

type LegislativeSearchFilterProps = {
  filterValue: LegislativeFilterValueType
  onChange: (value: LegislativeFilterValueType) => void
}

export const LegislativeSearchFilter = ({
  filterValue: _filterValue,
  onChange,
}: LegislativeSearchFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filterValue, setFilterValue] =
    useState<LegislativeFilterValueType>(_filterValue)
  const {
    legislativeMeetings: meetings,
    isLoading: isLoadingMeeting,
    error: errorToLoadMeeting,
  } = useLegislativeMeeting()
  const latestMeetingTerm = meetings?.[0]?.term?.toString()
  const {
    legislativeMeetingSessions: sessions,
    isLoading: isLoadingSessions,
    error: errorToLoadSession,
  } = useLegislativeMeetingSession(
    typeof filterValue.meeting === 'string' && filterValue.meeting !== 'all'
      ? filterValue.meeting
      : latestMeetingTerm
  )

  const getFilterOptions = (): FilterOption[] => {
    const options: FilterOption[] = [
      {
        type: SelectorType.Single,
        disabled: true,
        label: '單位',
        key: 'department',
        defaultValue: 'legislativeYuan',
        options: [{ label: '立法院', value: 'legislativeYuan' }],
      },
      {
        type: SelectorType.Single,
        disabled: false,
        defaultValue: ['all'],
        label: '屆期',
        key: 'meeting',
        isLoading: isLoadingMeeting,
        showError: errorToLoadMeeting,
        options: [
          { label: '全部屆期', value: 'all', isDeletable: false },
        ].concat(
          meetings.map(({ term }) => ({
            label: `第 ${term} 屆`,
            value: `${term}`,
            isDeletable: true,
          }))
        ),
      },
      {
        type: SelectorType.Multiple,
        disabled: filterValue.meeting === 'all',
        defaultValue: ['all'],
        label: '會期',
        key: 'meetingSession',
        isLoading: isLoadingSessions,
        showError: errorToLoadSession,
        options: [
          { label: '全部會期', value: 'all', isDeletable: false },
        ].concat(
          sessions.map(({ id, term, startTime, endTime }) => ({
            label: `第 ${term} 會期(${formatDate(
              startTime,
              'YYYY/MM'
            )}-${formatDate(endTime, 'YYYY/MM')})`,
            value: `${id}`,
            isDeletable: true,
          }))
        ),
      },
    ]
    return options
  }

  useEffect(() => {
    setFilterValue(_filterValue)
  }, [_filterValue])

  return (
    <>
      <FilterModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        initialValues={defaultLegislativeFilterValue}
        onSubmit={(value) => onChange(value as LegislativeFilterValueType)}
        onChange={(value) => {
          if (value.meeting === 'all') {
            setFilterValue(defaultLegislativeFilterValue)
            return
          }
          setFilterValue(value as LegislativeFilterValueType)
        }}
        options={getFilterOptions()}
        value={filterValue}
      />
      <FilterButton filterCount={0} onClick={() => setIsOpen(true)} />
    </>
  )
}

/**
 * Generate filter display string for legislative filter
 * @param filterValue - Current filter value
 * @returns Human-readable filter string
 */
export function buildLegislativeFilterString(
  filterValue: LegislativeFilterValueType
): string {
  // NOTE: department is not user-switchable in current UI,
  // so the display prefix is intentionally hard-coded.
  if (filterValue.meeting === 'all') {
    return '立法院｜全部屆期'
  }

  let result = `立法院｜第${filterValue.meeting}屆｜`

  if (filterValue.meetingSession[0] === 'all') {
    result += '全部會期'
  } else {
    result += '部分會期'
  }

  return result
}
