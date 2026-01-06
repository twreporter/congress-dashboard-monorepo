// type
import type { CouncilDistrict } from '@/types/council'

export type CouncilMeetingFromRes = {
  term: number
}

export type CouncilMeeting = {
  city: CouncilDistrict
  term: number
}
