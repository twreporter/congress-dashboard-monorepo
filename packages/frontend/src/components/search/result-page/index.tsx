'use client'

import React, { useState } from 'react'
import type { FilterValueType } from '@/components/search/result-page/filter'
import type { SearchStage } from '@/components/search/constants'
import mq from '@twreporter/core/lib/utils/media-query'
import styled from 'styled-components'
import { MultiStageHits, Hits } from '@/components/search/result-page/hits'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { indexNames, searchStages } from '@/components/search/constants'
import { AlgoliaInstantSearch } from '@/components/search/instant-search'
import {
  SearchFilter as _SearchFilter,
  defaultFilterValue,
} from '@/components/search/result-page/filter'

const Container = styled.div`
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

const searchTabs = [
  {
    label: '全部',
    value: searchStages.All,
  },
  {
    label: '發言全文',
    value: searchStages.Speech,
  },
]

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

const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  ${mq.mobileOnly`
    flex-wrap: wrap;
  `}

  width: 100%;

  border-bottom: 1px solid ${colorGrayscale.gray300};
`

const SearchFilter = styled(_SearchFilter)`
  ${mq.mobileOnly`
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  `}
`

type SearchResultsProps = {
  className?: string
  query?: string
}

const SearchResults = ({ className, query }: SearchResultsProps) => {
  const [activeTab, setActiveTab] = useState<SearchStage>(searchStages.All)
  const [filterValue, setFilterValue] =
    useState<FilterValueType>(defaultFilterValue)

  let filters = ''
  const meeting = filterValue.meeting
  const meetingSession = filterValue.meetingSession

  if (meeting !== 'all') {
    const meetingFilter = `term: ${meeting}`
    const meetingSessionFilter =
      meetingSession.indexOf('all') > -1
        ? ''
        : meetingSession.map((s) => `session: ${s}`).join(' OR ')
    filters = meetingSessionFilter
      ? `(${meetingFilter}) AND (${meetingSessionFilter})`
      : meetingFilter
  }

  function renderSearchFilter() {
    if (activeTab !== searchStages.Speech) {
      return null
    }

    return <SearchFilter filterValue={filterValue} onChange={setFilterValue} />
  }

  return (
    <Container className={className}>
      <BarAndResults>
        <Bar>
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
          {renderSearchFilter()}
        </Bar>
        <HitsContainer $hidden={activeTab !== searchStages.All}>
          <MultiStageHits query={query} />
        </HitsContainer>
        <HitsContainer $hidden={activeTab !== searchStages.Speech}>
          <Hits indexName={indexNames.Speech} query={query} filters={filters} />
        </HitsContainer>
      </BarAndResults>
    </Container>
  )
}

const InsantSearchContainer = styled.div`
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
      <InsantSearchContainer>
        <AlgoliaInstantSearch className="search-box" />
      </InsantSearchContainer>
      <SearchResults query={query} />
    </div>
  )
}
