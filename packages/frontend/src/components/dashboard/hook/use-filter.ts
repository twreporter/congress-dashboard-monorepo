import { useState, useMemo } from 'react'
// type
import type { FilterModalValueType } from '@/components/dashboard/type'
// lodash
import { find } from 'lodash'
const _ = {
  find,
}

const useFilter = (meetings) => {
  const latestMettingTerm = useMemo(() => `${meetings[0]?.term}`, [meetings])
  const [filterValues, setFilterValues] = useState<FilterModalValueType>({
    department: 'legislativeYuan',
    meeting: latestMettingTerm,
    meetingSession: ['all'],
    constituency: [],
    party: [],
    committee: [],
  })

  const formatter = (filterValues: FilterModalValueType) => {
    const meeting =
      _.find(meetings, ({ term }) => term === Number(filterValues.meeting)) ||
      meetings[0]
    const meetingId = Number(meeting.id)
    const partyIds = Array.isArray(filterValues.party)
      ? filterValues.party.map((idString: string) => Number(idString))
      : []
    const sessionIds =
      filterValues.meetingSession[0] === 'all' ||
      !Array.isArray(filterValues.meetingSession)
        ? []
        : filterValues.meetingSession.map((idString: string) =>
            Number(idString)
          )
    const constituency = filterValues.constituency as string[]

    return { meetingId, sessionIds, partyIds, constituency }
  }

  return { filterValues, setFilterValues, formatter }
}

export default useFilter
