import { useState, useMemo } from 'react'
// type
import type {
  FilterModalValueType,
  FilterFormatter,
} from '@/components/dashboard/type'
// lodash
import { find } from 'lodash'
const _ = {
  find,
}

const useFilter = (meetings) => {
  const latestMeetingTerm = useMemo(() => `${meetings[0]?.term}`, [meetings])
  const [filterValues, setFilterValues] = useState<FilterModalValueType>({
    department: 'legislativeYuan',
    meeting: latestMeetingTerm,
    meetingSession: ['all'],
    constituency: [],
    party: [],
    committee: [],
  })

  const formatter: FilterFormatter = (filterValues: FilterModalValueType) => {
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
    const committeeSlugs = filterValues.committee as string[]

    return { meetingId, sessionIds, partyIds, constituency, committeeSlugs }
  }

  const formattedFilterValues = useMemo(
    () => formatter(filterValues),
    [filterValues]
  )

  return { filterValues, setFilterValues, formatter, formattedFilterValues }
}

export default useFilter
