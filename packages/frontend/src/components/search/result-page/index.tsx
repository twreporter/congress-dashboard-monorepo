'use client'

import React, { useState } from 'react'
import type { SearchStage } from '@/components/search/constants'
import mq from '@twreporter/core/lib/utils/media-query'
import styled from 'styled-components'
import { MultiStageHits, Hits } from '@/components/search/result-page/hits'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { indexNames, searchStages } from '@/components/search/constants'
import { AlgoliaInstantSearch } from '@/components/search/instant-search'
// import { SearchFilter } from '@/components/search/result-page/filter'

const Container = styled.div`
  /* TODO: remove box-sizing if global already defined */
  * {
    box-sizing: border-box;
  }
  width: 100%;

  background-color: ${colorGrayscale.gray100};

  padding-top: 40px;
`

const HitsContainer = styled.div<{ $hidden: boolean }>`
  width: 100%;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;

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

  width: 100%;
  max-width: 720px;

  margin-left: auto;
  margin-right: auto;
  margin: 0px auto 56px auto;

  border-bottom: 1px solid ${colorGrayscale.gray300};
`

type SearchResultsProps = {
  className?: string
  query: string
}

const SearchResults = ({ className, query }: SearchResultsProps) => {
  const [activeTab, setActiveTab] = useState<SearchStage>(searchStages.All)
  return (
    <Container className={className}>
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
      </Bar>
      <HitsContainer $hidden={activeTab !== searchStages.All}>
        <MultiStageHits query={query} />
      </HitsContainer>
      <HitsContainer $hidden={activeTab !== searchStages.Speech}>
        <Hits indexName={indexNames.Speech} query={query} />
      </HitsContainer>
    </Container>
  )
}

const InsantSearchContainer = styled.div`
  background-color: ${colorGrayscale.gray200};
  height: 192px;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  ${mq.desktopAndAbove`
    .search-box {
      width: 560px;
    }
  `}

  ${mq.tabletOnly`
    .search-box {
      width: 480px;
    }
  `}

  ${mq.mobileOnly`
    .search-box {
      width: 100%;
      max-width: 480px;
    }
  `}
`

export type SearchPageProps = {
  query: string
}

export function SearchPage({ query }: SearchResultsProps) {
  return (
    <div key={query}>
      <InsantSearchContainer>
        <AlgoliaInstantSearch className="search-box" />
      </InsantSearchContainer>
      <SearchResults query={query} />
    </div>
  )
}
