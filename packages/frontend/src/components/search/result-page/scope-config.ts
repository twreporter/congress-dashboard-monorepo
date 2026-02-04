import type { OptionGroup } from '@/components/selector/types'

// Constants for scope values
export const scopeValues = {
  all: 'all',
  legislativeYuan: 'legislativeYuan',
  allCouncils: 'all-councils',
  taipeiCouncil: 'taipei-council',
  newTaipeiCouncil: 'new-taipei-council',
  taoyuanCouncil: 'taoyuan-council',
  taichungCouncil: 'taichung-council',
  tainanCouncil: 'tainan-council',
  kaohsiungCouncil: 'kaohsiung-council',
} as const

// Type for scope values
export type ScopeValue = (typeof scopeValues)[keyof typeof scopeValues]

// Council scope values array
export const councilScopeValues: ScopeValue[] = [
  scopeValues.allCouncils,
  scopeValues.taipeiCouncil,
  scopeValues.newTaipeiCouncil,
  scopeValues.taoyuanCouncil,
  scopeValues.taichungCouncil,
  scopeValues.tainanCouncil,
  scopeValues.kaohsiungCouncil,
]

// Helper functions
export const isCouncilScope = (scope: ScopeValue): boolean => {
  return councilScopeValues.includes(scope)
}

export const getScopeType = (
  scope: ScopeValue
): 'legislative' | 'council' | 'all' => {
  if (scope === scopeValues.legislativeYuan) return 'legislative'
  if (isCouncilScope(scope)) return 'council'
  return 'all'
}

// Council options (shared between filter groups)
const councilOptions = [
  { label: '六都議會', value: scopeValues.allCouncils },
  { label: '台北市議會', value: scopeValues.taipeiCouncil },
  { label: '新北市議會', value: scopeValues.newTaipeiCouncil },
  { label: '桃園市議會', value: scopeValues.taoyuanCouncil },
  { label: '台中市議會', value: scopeValues.taichungCouncil },
  { label: '台南市議會', value: scopeValues.tainanCouncil },
  { label: '高雄市議會', value: scopeValues.kaohsiungCouncil },
]

// Filter groups for scope selection
export const scopeFilterGroups: OptionGroup[] = [
  {
    groupName: '全部',
    options: [{ label: '立法院與六都議會', value: scopeValues.all }],
  },
  {
    groupName: '中央',
    options: [{ label: '立法院', value: scopeValues.legislativeYuan }],
  },
  {
    groupName: '地方',
    options: councilOptions,
  },
]

// Council-only filter groups for Bill tab
export const councilFilterGroups: OptionGroup[] = [
  {
    groupName: '地方',
    options: councilOptions,
  },
]
