import type { OptionGroup } from '@/components/selector/types'
import type { SearchStage } from '@/components/search/constants'
import { ValuesOf } from '@/types'
import { searchStages } from '@/components/search/constants'
import {
  CITY,
  type City,
} from '@twreporter/congress-dashboard-shared/lib/constants/city'

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
export type ScopeValue = ValuesOf<typeof scopeValues>

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

// Council-only filter groups for council bill tab
export const councilFilterGroups: OptionGroup[] = [
  {
    groupName: '地方',
    options: councilOptions,
  },
]

/**
 * Defines which search stages to use for each scope
 * Order matters: stages are loaded progressively in the specified order
 */
export const scopeIndexConfig: Record<ScopeValue, SearchStage[]> = {
  // 全部：立法院與六都議會
  [scopeValues.all]: [
    searchStages.Legislator,
    searchStages.Councilor,
    searchStages.Topic,
    searchStages.CouncilTopic,
    searchStages.Speech,
    searchStages.CouncilBill,
  ],

  // 立法院
  [scopeValues.legislativeYuan]: [
    searchStages.Legislator,
    searchStages.Topic,
    searchStages.Speech,
  ],

  // 六都議會（全部）
  [scopeValues.allCouncils]: [
    searchStages.Councilor,
    searchStages.CouncilTopic,
    searchStages.CouncilBill,
  ],

  // 特定縣市議會
  [scopeValues.taipeiCouncil]: [
    searchStages.Councilor,
    searchStages.CouncilTopic,
    searchStages.CouncilBill,
  ],
  [scopeValues.newTaipeiCouncil]: [
    searchStages.Councilor,
    searchStages.CouncilTopic,
    searchStages.CouncilBill,
  ],
  [scopeValues.taoyuanCouncil]: [
    searchStages.Councilor,
    searchStages.CouncilTopic,
    searchStages.CouncilBill,
  ],
  [scopeValues.taichungCouncil]: [
    searchStages.Councilor,
    searchStages.CouncilTopic,
    searchStages.CouncilBill,
  ],
  [scopeValues.tainanCouncil]: [
    searchStages.Councilor,
    searchStages.CouncilTopic,
    searchStages.CouncilBill,
  ],
  [scopeValues.kaohsiungCouncil]: [
    searchStages.Councilor,
    searchStages.CouncilTopic,
    searchStages.CouncilBill,
  ],
}

/**
 * Maps scope values to council slug for Algolia filtering
 * Uses councilSlug instead of council name for more reliable filtering
 */
export const councilFilterMap: Partial<Record<ScopeValue, City>> = {
  [scopeValues.taipeiCouncil]: CITY.taipei,
  [scopeValues.newTaipeiCouncil]: CITY.newTaipei,
  [scopeValues.taoyuanCouncil]: CITY.taoyuan,
  [scopeValues.taichungCouncil]: CITY.taichung,
  [scopeValues.tainanCouncil]: CITY.tainan,
  [scopeValues.kaohsiungCouncil]: CITY.kaohsiung,
}

/**
 * Builds Algolia filter string for council scope
 * @param scope - Current scope value
 * @returns Filter string for Algolia or empty string
 */
export function buildCouncilFilter(scope: ScopeValue): string {
  const councilSlug = councilFilterMap[scope]
  const filter = councilSlug ? `councilSlug: ${councilSlug}` : ''
  return filter
}

/**
 * Gets the list of search stages for a given scope
 * @param scope - Current scope value
 * @returns Array of search stages to query in order
 */
export function getScopeSearchStages(scope: ScopeValue): SearchStage[] {
  return scopeIndexConfig[scope] || scopeIndexConfig[scopeValues.all]
}
