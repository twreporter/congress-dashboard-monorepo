'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { LegislativeFilterValueType } from '@/components/search/result-page/legislative-filter'
import type { SearchStage } from '@/components/search/constants'
import mq from '@twreporter/core/lib/utils/media-query'
import styled from 'styled-components'
import { MultiStageHits, Hits } from '@/components/search/result-page/hits'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { indexNames, searchStages } from '@/components/search/constants'
import { AlgoliaInstantSearch } from '@/components/search/instant-search'
import {
  LegislativeSearchFilter as _LegislativeSearchFilter,
  defaultLegislativeFilterValue,
} from '@/components/search/result-page/legislative-filter'
import { PillButton } from '@twreporter/react-components/lib/button'
import { Filter as FilterIcon } from '@twreporter/react-components/lib/icon'
import { ScopeFilterModal } from '@/components/search/result-page/scope-filter-modal'
import type { OptionGroup } from '@/components/selector/types'

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

// Constants for scope values
const scopeValues = {
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
type ScopeValue = (typeof scopeValues)[keyof typeof scopeValues]

// Council scope values array
const councilScopeValues: ScopeValue[] = [
  scopeValues.allCouncils,
  scopeValues.taipeiCouncil,
  scopeValues.newTaipeiCouncil,
  scopeValues.taoyuanCouncil,
  scopeValues.taichungCouncil,
  scopeValues.tainanCouncil,
  scopeValues.kaohsiungCouncil,
]

const isCouncilScope = (scope: ScopeValue): boolean => {
  return councilScopeValues.includes(scope)
}

const getScopeType = (scope: ScopeValue): 'legislative' | 'council' | 'all' => {
  if (scope === scopeValues.legislativeYuan) return 'legislative'
  if (isCouncilScope(scope)) return 'council'
  return 'all'
}

const SearchResultsContainer = styled.div`
  /* TODO: remove box-sizing if global already defined */
  * {
    box-sizing: border-box;
  }
  width: 100%;

  background-color: ${colorGrayscale.gray100};

  ${mq.desktopAndAbove`
    padding-top: 40px;
  `}

  ${mq.tabletOnly`
    padding-top: 32px;
  `}

  ${mq.mobileOnly`
    padding-top: 20px;
  `}
`

const BarAndResults = styled.div`
  ${mq.desktopAndAbove`
    width: 720px;
  `}

  ${mq.tabletOnly`
    width: 704px;
  `}

  ${mq.mobileOnly`
    width: calc(327 / 375 * 100%);
  `}

  margin-left: auto;
  margin-right: auto;
`

const HitsContainer = styled.div<{ $hidden: boolean }>`
  width: 100%;

  ${({ $hidden }) => {
    if ($hidden) {
      return 'display: none;'
    }
  }}
`

const Tab = styled.div`
  display: inline-block;

  cursor: pointer;

  font-size: 18px;
  font-weight: 700;
  line-height: 150%;

  padding-top: 16px;
  padding-bottom: 16px;

  color: ${colorGrayscale.gray400};

  &.active {
    color: ${colorGrayscale.gray800};
    border-bottom: 2px solid ${colorGrayscale.gray800};
  }
`

const Tabs = styled.div`
  ${Tab} {
    margin-right: 20px;
  }

  ${Tab}:last-child {
    margin-right: 0;
  }
`

const SearchTabBar = styled.div`
  display: flex;
  justify-content: space-between;
  ${mq.mobileOnly`
    flex-wrap: wrap;
  `}

  width: 100%;

  border-bottom: 1px solid ${colorGrayscale.gray300};
`

const LegislativeSearchFilter = styled(_LegislativeSearchFilter)`
  ${mq.mobileOnly`
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  `}
`

const ScopeFilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  ${mq.mobileOnly`
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
  `}
`

const ScopeFilterLabel = styled.div`
  color: ${colorGrayscale.gray700};
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
`

const scopeFilterGroups: OptionGroup[] = [
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
    options: [
      { label: '六都議會', value: scopeValues.allCouncils },
      { label: '台北市議會', value: scopeValues.taipeiCouncil },
      { label: '新北市議會', value: scopeValues.newTaipeiCouncil },
      { label: '桃園市議會', value: scopeValues.taoyuanCouncil },
      { label: '台中市議會', value: scopeValues.taichungCouncil },
      { label: '台南市議會', value: scopeValues.tainanCouncil },
      { label: '高雄市議會', value: scopeValues.kaohsiungCouncil },
    ],
  },
]

// Council-only filter groups for Bill tab
const councilFilterGroups: OptionGroup[] = [
  {
    groupName: '地方',
    options: [
      { label: '六都議會', value: scopeValues.allCouncils },
      { label: '台北市議會', value: scopeValues.taipeiCouncil },
      { label: '新北市議會', value: scopeValues.newTaipeiCouncil },
      { label: '桃園市議會', value: scopeValues.taoyuanCouncil },
      { label: '台中市議會', value: scopeValues.taichungCouncil },
      { label: '台南市議會', value: scopeValues.tainanCouncil },
      { label: '高雄市議會', value: scopeValues.kaohsiungCouncil },
    ],
  },
]

type SearchResultsProps = {
  className?: string
  query?: string
}

const SearchResults = ({ className, query }: SearchResultsProps) => {
  const [activeTab, setActiveTab] = useState<SearchStage>(searchStages.All)
  const [filterValue, setFilterValue] = useState<LegislativeFilterValueType>(
    defaultLegislativeFilterValue
  )
  const [scopeFilterValue, setScopeFilterValue] = useState<ScopeValue>(
    scopeValues.all
  )
  const [scopeFilterLabel, setScopeFilterLabel] = useState('立法院與六都議會')
  const [showScopeModal, setShowScopeModal] = useState(false)

  // Dynamically determine tabs based on scopeFilterValue
  const searchTabs = useMemo(() => {
    if (scopeFilterValue === scopeValues.legislativeYuan) {
      return [
        {
          label: '全部',
          value: searchStages.All,
        },
        {
          label: '發言全文',
          value: searchStages.Speech,
        },
      ]
    } else if (isCouncilScope(scopeFilterValue)) {
      return [
        {
          label: '全部',
          value: searchStages.All,
        },
        {
          label: '議案',
          value: searchStages.Bill,
        },
      ]
    } else {
      return [
        {
          label: '全部',
          value: searchStages.All,
        },
      ]
    }
  }, [scopeFilterValue])

  // Reset to "All" tab when scope TYPE changes (not just value)
  const prevScopeTypeRef = useRef(getScopeType(scopeFilterValue))
  useEffect(() => {
    const currentScopeType = getScopeType(scopeFilterValue)
    const prevScopeType = prevScopeTypeRef.current

    // Only reset tab if scope TYPE changed (e.g., legislative <-> council <-> all)
    if (currentScopeType !== prevScopeType) {
      setActiveTab(searchStages.All)
      prevScopeTypeRef.current = currentScopeType
    }
  }, [scopeFilterValue])

  let filters = ''
  const meeting = filterValue.meeting
  const meetingSession = filterValue.meetingSession

  if (meeting !== 'all') {
    const meetingFilter = `meetingTerm: ${meeting}`
    const meetingSessionFilter =
      meetingSession.indexOf('all') > -1
        ? ''
        : meetingSession.map((s) => `sessionTerm: ${s}`).join(' OR ')
    filters = meetingSessionFilter
      ? `(${meetingFilter}) AND (${meetingSessionFilter})`
      : meetingFilter
  }

  function renderScopeFilter() {
    if (activeTab !== searchStages.All) {
      return null
    }

    return (
      <>
        <ScopeFilterContainer>
          <ScopeFilterLabel>{scopeFilterLabel}</ScopeFilterLabel>
          <PillButton
            theme={PillButton.THEME.normal}
            type={PillButton.Type.SECONDARY}
            size={PillButton.Size.L}
            text="篩選"
            leftIconComponent={<FilterIcon releaseBranch={releaseBranch} />}
            onClick={() => {
              setShowScopeModal(true)
            }}
          />
        </ScopeFilterContainer>
        <ScopeFilterModal
          isOpen={showScopeModal}
          groups={scopeFilterGroups}
          selectedValue={scopeFilterValue}
          onSubmit={(value, label) => {
            setScopeFilterValue(value as ScopeValue)
            setScopeFilterLabel(label)
          }}
          onClose={() => setShowScopeModal(false)}
        />
      </>
    )
  }

  function renderCouncilFilter() {
    if (activeTab !== searchStages.Bill) {
      return null
    }

    return (
      <>
        <ScopeFilterContainer>
          <ScopeFilterLabel>{scopeFilterLabel}</ScopeFilterLabel>
          <PillButton
            theme={PillButton.THEME.normal}
            type={PillButton.Type.SECONDARY}
            size={PillButton.Size.L}
            text="篩選"
            leftIconComponent={<FilterIcon releaseBranch={releaseBranch} />}
            onClick={() => {
              setShowScopeModal(true)
            }}
          />
        </ScopeFilterContainer>
        <ScopeFilterModal
          isOpen={showScopeModal}
          groups={councilFilterGroups}
          selectedValue={scopeFilterValue}
          onSubmit={(value, label) => {
            setScopeFilterValue(value as ScopeValue)
            setScopeFilterLabel(label)
          }}
          onClose={() => setShowScopeModal(false)}
        />
      </>
    )
  }

  function renderFilterByTab() {
    // Show ScopeFilter for "All" tab
    if (activeTab === searchStages.All) {
      return renderScopeFilter()
    }

    // Show LegislativeSearchFilter for "Speech" tab (only when legislativeYuan is selected)
    if (
      activeTab === searchStages.Speech &&
      scopeFilterValue === scopeValues.legislativeYuan
    ) {
      return (
        <LegislativeSearchFilter
          filterValue={filterValue}
          onChange={setFilterValue}
        />
      )
    }

    // Show CouncilFilter for "Bill" tab (only when council scope is selected)
    if (activeTab === searchStages.Bill && isCouncilScope(scopeFilterValue)) {
      return renderCouncilFilter()
    }

    return null
  }

  return (
    <SearchResultsContainer className={className}>
      <BarAndResults>
        <SearchTabBar>
          <Tabs>
            {searchTabs.map((searchTab) => {
              return (
                <Tab
                  key={searchTab.value}
                  className={searchTab.value === activeTab ? 'active' : ''}
                  onClick={() => {
                    setActiveTab(searchTab.value)
                  }}
                >
                  {searchTab.label}
                </Tab>
              )
            })}
          </Tabs>
          {renderFilterByTab()}
        </SearchTabBar>
        <HitsContainer $hidden={activeTab !== searchStages.All}>
          <MultiStageHits query={query} />
        </HitsContainer>
        <HitsContainer $hidden={activeTab !== searchStages.Speech}>
          <Hits indexName={indexNames.Speech} query={query} filters={filters} />
        </HitsContainer>
        <HitsContainer $hidden={activeTab !== searchStages.Bill}>
          <Hits indexName={indexNames.Bill} query={query} />
        </HitsContainer>
      </BarAndResults>
    </SearchResultsContainer>
  )
}

const InstantSearchContainer = styled.div`
  background-color: ${colorGrayscale.gray200};
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  ${mq.desktopAndAbove`
    height: 192px;

    .search-box {
      width: 560px;
    }
  `}

  ${mq.tabletOnly`
    height: 160px;

    .search-box {
      width: 480px;
    }
  `}

  ${mq.mobileOnly`
    height: 128px;

    .search-box {
      width: calc(327 / 375 * 100%);
    }
  `}
`

export type SearchPageProps = {
  query?: string
}

export function SearchPage({ query }: SearchPageProps) {
  return (
    <div key={query}>
      <InstantSearchContainer>
        <AlgoliaInstantSearch className="search-box" query={query} />
      </InstantSearchContainer>
      <SearchResults query={query} />
    </div>
  )
}
