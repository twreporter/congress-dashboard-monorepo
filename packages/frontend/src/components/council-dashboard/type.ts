// type
import type { Tag } from '@/components/dashboard/type'
import type { KeystoneImage } from '@/types'
import type { MemberType } from '@twreporter/congress-dashboard-shared/lib/constants/council-member'

export type CouncilorForDashboard = {
  id?: number
  name?: string
  slug: string
  avatar?: string
  partyAvatar?: string
  tooltip?: string
  note?: string
  count?: number
  tags?: Tag[]
  type?: MemberType
  constituency?: number
}

export type CouncilorForIndex = {
  id: number
  councilor: {
    name: string
    slug: string
    image?: KeystoneImage
    imageLink?: string
  }
  party: {
    image?: KeystoneImage
    imageLink?: string
  }
  type?: MemberType
  constituency?: number
  tooltip?: string
  note?: string
}

export type CouncilFormattedFilterValue = {
  meetingId: number
  partyIds: number[]
  constituency: number[]
}

export type CouncilFilterFormatter = (
  filterValues: CouncilFilterModalValueType
) => CouncilFormattedFilterValue

export type CouncilFilterModalValueType = {
  [key: string]: string | string[]
}
