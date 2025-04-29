import { createContext, Dispatch, SetStateAction } from 'react'
// enum
import { Option } from '@/components/dashboard/enum'
// type
import type {
  FilterModalValueType,
  FormattedFilterValue,
} from '@/components/dashboard/type'

type DashboardContextValue = {
  tabType: Option
  filterValues: FilterModalValueType
  setFilterValues: Dispatch<SetStateAction<FilterModalValueType>>
  formattedFilterValues?: FormattedFilterValue
}

const defaultValue = {
  tabType: Option.Issue,
  filterValues: {},
  setFilterValues: () => {},
}

export const DashboardContext =
  createContext<DashboardContextValue>(defaultValue)
