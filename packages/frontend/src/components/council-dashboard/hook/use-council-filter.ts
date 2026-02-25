import { useState, useMemo, useCallback } from 'react'
// type
import type {
  CouncilFilterModalValueType,
  CouncilFormattedFilterValue,
  CouncilFilterFormatter,
} from '@/components/council-dashboard/type'
import type { CouncilMeeting } from '@/types/council-meeting'
// lodash
import { find } from 'lodash'
const _ = {
  find,
}

const useCouncilFilter = (meetings: CouncilMeeting[]) => {
  const latestMeetingTerm = useMemo(() => `${meetings[0]?.term}`, [meetings])
  const [filterValues, setFilterValues] = useState<CouncilFilterModalValueType>(
    {
      meeting: latestMeetingTerm,
      administrativeDistrict: [],
      type: 'all',
      constituency: [],
      party: [],
    }
  )

  const formatter: CouncilFilterFormatter = useCallback(
    (
      filterValues: CouncilFilterModalValueType
    ): CouncilFormattedFilterValue => {
      const meeting =
        _.find(meetings, ({ term }) => term === Number(filterValues.meeting)) ||
        meetings[0]
      const meetingId = Number(meeting.id)
      const partyIds = Array.isArray(filterValues.party)
        ? filterValues.party.map((idString: string) => Number(idString))
        : []
      const constituency = Array.isArray(filterValues.constituency)
        ? filterValues.constituency.map((idString: string) => Number(idString))
        : []
      const types =
        filterValues.type && filterValues.type !== 'all'
          ? [filterValues.type as string]
          : []
      const administrativeDistricts = Array.isArray(
        filterValues.administrativeDistrict
      )
        ? filterValues.administrativeDistrict
        : []

      return {
        meetingId,
        partyIds,
        constituency,
        types,
        administrativeDistricts,
      }
    },
    [meetings]
  )

  const formattedFilterValues = useMemo(
    () => formatter(filterValues),
    [filterValues, formatter]
  )

  return { filterValues, setFilterValues, formatter, formattedFilterValues }
}

export default useCouncilFilter
