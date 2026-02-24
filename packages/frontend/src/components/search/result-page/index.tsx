'use client'

import React, { useEffect, useRef, useState } from 'react'
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
import { ScopeFilter as _ScopeFilter } from '@/components/search/result-page/scope-filter'
import {
  scopeValues,
  type ScopeValue,
  isCouncilScope,
  getScopeType,
  scopeFilterGroups,
  councilFilterGroups,
  buildCouncilFilter,
} from '@/components/search/result-page/scope-config'
import type {
  SearchResultsProps,
  SearchPageProps,
} from '@/components/search/result-page/types'

function buildLegislativeSpeechFilters(
  filterValue: LegislativeFilterValueType
): string {
  const meeting = filterValue.meeting
  if (meeting === 'all') return ''

  const meetingFilter = `meetingTerm: ${meeting}`
  const meetingSession = filterValue.meetingSession
  const meetingSessionFilter =
    meetingSession.indexOf('all') > -1
      ? ''
      : meetingSession.map((s) => `sessionTerm: ${s}`).join(' OR ')

  return meetingSessionFilter
    ? `(${meetingFilter}) AND (${meetingSessionFilter})`
    : meetingFilter
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
    padding-bottom: 120px;
  `}

  ${mq.tabletOnly`
    padding-top: 32px;
    padding-bottom: 120px;
  `}

  ${mq.mobileOnly`
    padding-top: 20px;
    padding-bottom: 64px;
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

const HitsContainer = styled.div<{ $hidden?: boolean }>`
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

const ScopeFilter = styled(_ScopeFilter)`
  ${mq.mobileOnly`
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
  `}
`

const SearchResults = ({ className, query }: SearchResultsProps) => {
  const [activeTab, setActiveTab] = useState<SearchStage>(searchStages.All)
  const [filterValue, setFilterValue] = useState<LegislativeFilterValueType>(
    defaultLegislativeFilterValue
  )
  const [scopeFilterValue, setScopeFilterValue] = useState<ScopeValue>(
    scopeValues.all
  )
  const [scopeFilterLabel, setScopeFilterLabel] = useState('立法院與六都議會')

  // Track which tabs have been mounted (for lazy mounting)
  const [mountedTabs, setMountedTabs] = useState<Set<SearchStage>>(
    new Set([searchStages.All])
  )

  // Mark tab as mounted when activated
  useEffect(() => {
    setMountedTabs((prev) => new Set(prev).add(activeTab))
  }, [activeTab])

  // Build council filter for specific council scopes
  const councilFilter = buildCouncilFilter(scopeFilterValue)
  // Build speech filter for specific legislative meeting and session terms
  const speechFilter = buildLegislativeSpeechFilters(filterValue)

  // Dynamically determine tabs based on scopeFilterValue
  const searchTabs = (() => {
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
          value: searchStages.CouncilBill,
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
  })()

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

  function renderFilterByTab() {
    // Show ScopeFilter for "All" tab
    if (activeTab === searchStages.All) {
      return (
        <ScopeFilter
          groups={scopeFilterGroups}
          selectedValue={scopeFilterValue}
          selectedLabel={scopeFilterLabel}
          onChange={(value, label) => {
            setScopeFilterValue(value)
            setScopeFilterLabel(label)
          }}
        />
      )
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
    if (
      activeTab === searchStages.CouncilBill &&
      isCouncilScope(scopeFilterValue)
    ) {
      return (
        <ScopeFilter
          groups={councilFilterGroups}
          selectedValue={scopeFilterValue}
          selectedLabel={scopeFilterLabel}
          onChange={(value, label) => {
            setScopeFilterValue(value)
            setScopeFilterLabel(label)
          }}
        />
      )
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
          <MultiStageHits
            key={`${scopeFilterValue}-${query}`}
            query={query}
            scope={scopeFilterValue}
          />
        </HitsContainer>
        {mountedTabs.has(searchStages.Speech) && (
          <HitsContainer $hidden={activeTab !== searchStages.Speech}>
            <Hits
              key={`${indexNames.Speech}-${speechFilter}`}
              indexName={indexNames.Speech}
              query={query}
              filters={speechFilter}
            />
          </HitsContainer>
        )}
        {mountedTabs.has(searchStages.CouncilBill) && (
          <HitsContainer $hidden={activeTab !== searchStages.CouncilBill}>
            <Hits
              key={`${indexNames.CouncilBill}-${councilFilter}`}
              indexName={indexNames.CouncilBill}
              query={query}
              filters={councilFilter}
            />
          </HitsContainer>
        )}
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
