import { createContext, Dispatch, SetStateAction } from 'react'
// enum
import { Option } from '@/components/dashboard/enum'
// type
import type {
  CouncilFilterModalValueType,
  CouncilFormattedFilterValue,
} from '@/components/council-dashboard/type'

type CouncilDashboardContextValue = {
  tabType: Option
  filterValues: CouncilFilterModalValueType
  setFilterValues: Dispatch<SetStateAction<CouncilFilterModalValueType>>
  formattedFilterValues?: CouncilFormattedFilterValue
}

const defaultValue = {
  tabType: Option.Issue,
  filterValues: {},
  setFilterValues: () => {},
}

export const CouncilDashboardContext =
  createContext<CouncilDashboardContextValue>(defaultValue)
