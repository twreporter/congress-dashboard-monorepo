// enum
import { SelectorType } from '@/components/selector'
// type
import type { OptionGroup, Option } from '@/components/selector/types'
import type { LegislatorForDashboard } from '@/types/legislator'

export type FilterOption = {
  type: SelectorType
  hide?: boolean
  disabled?: boolean
  label: string
  key: string
  options: Option[] | OptionGroup[]
  defaultValue?: string | string[]
  isLoading?: boolean
  showError?: boolean
}

export type FilterModalValueType = {
  [key: string]: string | string[]
}

export type Legislator = LegislatorForDashboard

export type Tag = {
  name: string
  count: number
}

export type FormattedFilterValue = {
  meetingId: number
  sessionIds: number[]
  partyIds: number[]
  constituency: string[]
  committeeSlugs: string[]
}

export type FilterFormatter = (
  filterValues: FilterModalValueType
) => FormattedFilterValue
