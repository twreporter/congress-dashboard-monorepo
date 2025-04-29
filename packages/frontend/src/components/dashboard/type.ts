// enum
import { SelectorType } from '@/components/selector'
// type
import type { OptionGroup, Option } from '@/components/selector/types'

export type FilterOption = {
  type: SelectorType
  hide?: boolean
  disabled?: boolean
  label: string
  key: string
  options: Option[] | OptionGroup[]
  defaultValue?: string | string[]
  isLoading?: boolean
}

export type FilterModalValueType = {
  [key: string]: string | string[]
}

export type Legislator = {
  id?: number
  name?: string
  avatar?: string
  partyAvatar?: string
  slug: string
  tooltip?: string
  note?: string
  count?: number
  tags?: Tag[]
}

export type Tag = {
  name: string
  count: number
}

export type FormattedFilterValue = {
  meetingId: number
  sessionIds: number[]
  partyIds: number[]
  constituency: string[]
}

export type FilterFormatter = (
  filterValues: FilterModalValueType
) => FormattedFilterValue
