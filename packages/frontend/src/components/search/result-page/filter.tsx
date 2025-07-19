'use client'

import FilterButton from '@/components/button/filter-button'
import FilterModal from '@/components/filter-modal'
import mq from '@twreporter/core/lib/utils/media-query'
import styled from 'styled-components'
import type { FilterOption } from '@/components/dashboard/type'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { useState } from 'react'
import { SelectorType } from '@/components/selector'
import { formatDate } from '@/utils/date-formatters'
import { useLegislativeMeeting } from '@/fetchers/legislative-meeting'
import { useLegislativeMeetingSession } from '@/fetchers/legislative-meeting'

type FilterValueType = {
  meeting: string
  meetingSession: string[]
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
  margin-right: 20px;

  ${mq.mobileOnly`
    font-size: 14px;  
  `}
`

export const SearchFilter = ({
  onChange,
}: {
  onChange: (FilterValueType) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const defaultFilterValue = {
    meeting: 'all',
    meetingSession: ['all'],
  }
  const [filterValue, setFilterValue] =
    useState<FilterValueType>(defaultFilterValue)
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
        onSubmit={(value) => {
          if (value.meetingSession.indexOf('all') > -1) {
            const meetingSession = sessions.map(({ id }) => id.toString())
            onChange({
              meeting: value.meeting as string,
              meetingSession,
            })
            return
          }
          onChange(value)
        }}
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
      <Container onClick={() => setIsOpen(true)}>
        <FilterString>{filterString}</FilterString>
        <FilterButton filterCount={0} />
      </Container>
    </>
  )
}
