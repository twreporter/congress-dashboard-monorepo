'use client'

import FilterButton from '@/components/button/filter-button'
import FilterModal from '@/components/filter-modal'
import styled from 'styled-components'
import type { FilterOption } from '@/components/dashboard/type'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { useState } from 'react'
import { SelectorType } from '@/components/selector'
import { formatDate } from '@/utils/date-formatters'
import { useLegislativeMeeting } from '@/fetchers/legislative-meeting'
import { useLegislativeMeetingSession } from '@/fetchers/legislative-meeting'

export type FilterValueType = {
  meeting: string
  meetingSession: string[]
}

export const defaultFilterValue = {
  meeting: 'all',
  meetingSession: ['all'],
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

const FilterString = styled.div`
  color: ${colorGrayscale.gray700};
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
`

export const SearchFilter = ({
  className,
  filterValue: _filterValue,
  onChange,
}: {
  className?: string
  filterValue: FilterValueType
  onChange: (FilterValueType) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filterValue, setFilterValue] = useState<FilterValueType>(_filterValue)
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
  } = useLegislativeMeetingSession(latestMeetingTerm)

  const getFilterOptions = (): FilterOption[] => {
    const options: FilterOption[] = [
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

  let filterString = '全部屆期'

  if (filterValue.meeting !== 'all') {
    filterString = `第${filterValue.meeting}屆｜`

    if (filterValue.meetingSession[0] === 'all') {
      filterString += `全部會期`
    } else {
      filterString += `部分會期`
    }
  }

  return (
    <>
      <FilterModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        initialValues={defaultFilterValue}
        onSubmit={onChange}
        onChange={(value) => {
          if (value.meeting === 'all') {
            setFilterValue(defaultFilterValue)
            return
          }
          setFilterValue(value as FilterValueType)
        }}
        options={getFilterOptions()}
        value={filterValue}
      />
      <Container className={className} onClick={() => setIsOpen(true)}>
        <FilterString>{filterString}</FilterString>
        <FilterButton filterCount={0} />
      </Container>
    </>
  )
}
