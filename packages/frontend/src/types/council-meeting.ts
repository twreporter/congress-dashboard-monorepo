// type
import type { CouncilDistrict } from '@/types/council'

export type CouncilMeetingFromRes = {
  id: number
  term: number
}

export type CouncilMeeting = {
  id: number
  city: CouncilDistrict
  term: number
}
