import type { KeystoneImage } from '@/types/index'
import type { CouncilDistrict } from '@/types/council'
import type { MemberType } from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'

export type CouncilorMemberMeta = {
  councilor: {
    name: string
  }
}

export type RelatedLink = {
  url: string
  label: string
}

export type CouncilorType = MemberType

export type CouncilorMemberData = {
  type?: string
  constituency?: number
  administrativeDistrict?: string[]
  note?: string
  tooltip?: string
  proposalSuccessCount?: number
  relatedLink?: RelatedLink[]
  isActive: boolean
  councilor: {
    name: string
    image?: KeystoneImage
    imageLink?: string
    externalLink?: string
    meetingTermCount?: number
    meetingTermCountInfo?: string
  }
  party: {
    name: string
    image?: KeystoneImage
    imageLink?: string
  }
  councilMeeting: {
    term: number
    city: string
  }
}

export type CouncilorForLawmaker = {
  slug: string
  name: string
  avatar: string
  city: CouncilDistrict
  type?: string
  constituency?: number
  administrativeDistrict: string[]
  note?: string
  tooltip?: string
  proposalSuccessCount: number
  relatedLink: RelatedLink[]
  externalLink?: string
  meetingTermCount: number
  meetingTermCountInfo: string
  isActive: boolean
  party: {
    name: string
    image: string
  }
  councilMeeting: {
    term: number
    city: CouncilDistrict
  }
}

export type CouncilorWithBillCount = {
  slug: string
  name: string
  avatar: string
  count: number
}
