'use client'

import EmptyState from '@twreporter/react-components/lib/empty-state'
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import type { IndexName, SearchStage } from '@/components/search/constants'
import styled from 'styled-components'
import {
  searchStages,
  indexNames,
  instantSearchStatus,
} from '@/components/search/constants'
import {
  getScopeSearchStages,
  buildCouncilFilter,
  scopeValues,
  type ScopeValue,
} from '@/components/search/result-page/scope-config'
import type {
  LegislatorRawHit,
  TopicRawHit,
  CouncilorRawHit,
  CouncilTopicRawHit,
} from '@/components/search/instant-hit'
import type {
  SpeechRawHit,
  CouncilBillRawHit,
} from '@/components/search/result-page/hit'
import {
  LegislatorHit,
  TopicHit,
  CouncilorHit,
  CouncilTopicHit,
  SpeechHit,
  CouncilBillHit,
} from '@/components/search/result-page/hit'
import {
  Configure,
  Index,
  InstantSearch,
  useSearchBox,
  useInfiniteHits,
  useInstantSearch,
} from 'react-instantsearch'
import { PillButton as _PillButton } from '@twreporter/react-components/lib/button'
import { createAlgoliaSearchClient } from '@/components/search/algolia-client'

const hitsPerPage = 10
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

const Container = styled.div`
  width: 100%;
  min-height: 400px;

  a {
    text-decoration: none;
  }
`

const LoadMoreBlock = styled.div`
  width: fit-content;
  padding-top: 64px;
  padding-bottom: 120px;
  margin-left: auto;
  margin-right: auto;
`

const PillButton = styled(_PillButton)`
  padding: 8px 114px;
`

const EmptyStateContainer = styled.div`
  padding-top: 72px;
  padding-bottom: 120px;
`

function PrefillQuery({ query }: { query?: string }) {
  const { refine } = useSearchBox()

  useEffect(() => {
    refine(query ?? '')
  }, [refine, query])

  return null
}

function EmptyResultChecker({ indexNames }: { indexNames: IndexName[] }) {
  const { renderState, status } = useInstantSearch()

  if (
    status === instantSearchStatus.Stalled ||
    status === instantSearchStatus.Loading
  ) {
    return null
  }

  for (const indexName of indexNames) {
    const hitsState = renderState[indexName]?.infiniteHits
    // infiniteHits is not ready
    if (!hitsState?.results) {
      return null
    }

    if (hitsState?.items?.length > 0) {
      return null
    }
  }

  return (
    <EmptyStateContainer>
      <EmptyState
        releaseBranch={releaseBranch}
        title={'查無資料'}
        showGuide={true}
        guide={'請重新設定篩選項目'}
        showButton={false}
        style={EmptyState.Style.DEFAULT}
      />
    </EmptyStateContainer>
  )
}

/**
 * Helper: Determines if a stage should be rendered based on current progress
 * @param currentStage - The current active stage
 * @param targetStage - The stage to check
 * @param searchStagesList - List of stages enabled for current scope
 * @returns true if the target stage should be rendered
 */
function shouldRenderStage(
  currentStage: SearchStage,
  targetStage: SearchStage,
  searchStagesList: SearchStage[]
): boolean {
  if (!searchStagesList.includes(targetStage)) {
    return false
  }
  const currentIndex = searchStagesList.indexOf(currentStage)
  const targetIndex = searchStagesList.indexOf(targetStage)
  return currentIndex >= targetIndex
}

/**
 * Renders Algolia hits from multiple <Index> components
 * in a progressive staged order based on scope.
 *
 * Default order (scope='all'): Legislator → Councilor → Topic → CouncilTopic → Speech → CouncilBill
 * Legislative scope: Legislator → Topic → Speech
 * Council scopes: Councilor → CouncilTopic → CouncilBill
 */
export const MultiStageHits = ({
  className,
  query,
  scope = scopeValues.all,
}: {
  className?: string
  query?: string
  scope?: ScopeValue
}) => {
  const searchClient = useMemo(createAlgoliaSearchClient, [])
  const containerRef = useRef<HTMLDivElement>(null)

  // Get search stages for current scope (memoized for stable array reference)
  const searchStagesList = useMemo(() => getScopeSearchStages(scope), [scope])

  // Build council filter if needed
  const councilFilter = buildCouncilFilter(scope)

  const [stage, setStage] = useState<SearchStage>(searchStagesList[0])

  // Reset stage when scope changes
  useEffect(() => {
    // If current stage is not in new searchStagesList, reset to first stage
    if (!searchStagesList.includes(stage)) {
      setStage(searchStagesList[0])
    }
  }, [searchStagesList, stage])

  if (!searchClient) {
    // @TODO render placeholder
    return null
  }

  return (
    <Container ref={containerRef} className={className}>
      <InstantSearch
        indexName={searchStagesList[0] as IndexName}
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <EmptyResultChecker indexNames={searchStagesList as IndexName[]} />

        {/* Legislator Index */}
        {shouldRenderStage(
          stage,
          searchStages.Legislator,
          searchStagesList
        ) && (
          <Index
            key={`${indexNames.Legislator}-${query}`}
            indexName={indexNames.Legislator}
          >
            <PrefillQuery query={query} />
            <Configure hitsPerPage={hitsPerPage} />
            <LegislatorHitsList />
          </Index>
        )}

        {/* Councilor Index */}
        {shouldRenderStage(stage, searchStages.Councilor, searchStagesList) && (
          <Index
            key={`${indexNames.Councilor}-${query}-${councilFilter}`}
            indexName={indexNames.Councilor}
          >
            <PrefillQuery query={query} />
            <Configure hitsPerPage={hitsPerPage} filters={councilFilter} />
            <CouncilorHitsList />
          </Index>
        )}

        {/* Topic Index */}
        {shouldRenderStage(stage, searchStages.Topic, searchStagesList) && (
          <Index
            key={`${indexNames.Topic}-${query}`}
            indexName={indexNames.Topic}
          >
            <PrefillQuery query={query} />
            <Configure hitsPerPage={hitsPerPage} />
            <TopicHitsList />
          </Index>
        )}

        {/* CouncilTopic Index */}
        {shouldRenderStage(
          stage,
          searchStages.CouncilTopic,
          searchStagesList
        ) && (
          <Index
            key={`${indexNames.CouncilTopic}-${query}-${councilFilter}`}
            indexName={indexNames.CouncilTopic}
          >
            <PrefillQuery query={query} />
            <Configure hitsPerPage={hitsPerPage} filters={councilFilter} />
            <CouncilTopicHitsList />
          </Index>
        )}

        {/* Speech Index */}
        {shouldRenderStage(stage, searchStages.Speech, searchStagesList) && (
          <Index
            key={`${indexNames.Speech}-${query}`}
            indexName={indexNames.Speech}
          >
            <PrefillQuery query={query} />
            <Configure hitsPerPage={hitsPerPage} />
            <SpeechHitsList />
          </Index>
        )}

        {/* CouncilBill Index */}
        {shouldRenderStage(
          stage,
          searchStages.CouncilBill,
          searchStagesList
        ) && (
          <Index
            key={`${indexNames.CouncilBill}-${query}-${councilFilter}`}
            indexName={indexNames.CouncilBill}
          >
            <PrefillQuery query={query} />
            <Configure hitsPerPage={hitsPerPage} filters={councilFilter} />
            <CouncilBillHitsList />
          </Index>
        )}

        <LoadMoreForStages
          stage={stage}
          setStage={setStage}
          searchStagesList={searchStagesList}
        />
      </InstantSearch>
    </Container>
  )
}

const noMoreStage = 'no_more_stage' as const

const voidFunction = () => {}

/**
 * Builds dynamic stage configuration based on search stages list
 * @param searchStagesList - List of search stages for current scope
 * @returns Configuration mapping each stage to its index name and next stage
 */
function buildStageConfig(searchStagesList: SearchStage[]) {
  const config: Record<
    string,
    { indexName: IndexName; nextStage: SearchStage | typeof noMoreStage }
  > = {}

  searchStagesList.forEach((stage, index) => {
    const nextStage = searchStagesList[index + 1] || noMoreStage
    config[stage] = {
      indexName: stage as IndexName,
      nextStage,
    }
  })

  return config
}

const LoadMoreForStages = ({
  stage,
  setStage,
  searchStagesList,
}: {
  stage: SearchStage
  setStage: React.Dispatch<React.SetStateAction<SearchStage>>
  searchStagesList: SearchStage[]
}) => {
  // `renderState` structure from multiple <Index> components:
  //  {
  //    // legislator index
  //    legislator: {
  //      // To see all properties of `inifiniteHits`, see [docs here](https://www.algolia.com/doc/api-reference/widgets/infinite-hits/react/#hook-api).
  //      inifiniteHits: { isLastPage: false, items: [], hits: [], results: undefined, showMore: () => { ... } },
  //    },
  //    // councilor index
  //    councilor: {
  //      inifiniteHits: { isLastPage: false, items: [], hits: [], results: undefined, showMore: () => { ... } },
  //    },
  //    // topic index
  //    topic: {
  //      inifiniteHits: { isLastPage: false, items: [], hits: [], results: undefined, showMore: () => { ... } },
  //    },
  //    // council-topic index
  //    'council-topic': {
  //      inifiniteHits: { isLastPage: false, items: [], hits: [], results: undefined, showMore: () => { ... } },
  //    },
  //    // speech index
  //    speech: {
  //      inifiniteHits: { isLastPage: false, items: [], hits: [], results: undefined, showMore: () => { ... } },
  //    },
  //    // council-bill index
  //    'council-bill': {
  //      inifiniteHits: { isLastPage: false, items: [], hits: [], results: undefined, showMore: () => { ... } },
  //    }
  //  }
  const { renderState, status } = useInstantSearch()

  // Build dynamic stage config based on search stages list
  const stageConfig = buildStageConfig(searchStagesList)

  // Per [react-instantsearch docs](https://www.algolia.com/doc/api-reference/widgets/use-instantsearch/react/#widget-param-status):
  // show loading indicator only when status === 'stalled'
  const showLoadingIcon = status === instantSearchStatus.Stalled

  const { indexName, nextStage } = stageConfig[stage] || {}
  const hitsState = renderState[indexName]?.infiniteHits

  // Load items progressively through the configured stages
  const load = useCallback(() => {
    // infiniteHits is not ready
    if (!hitsState?.results) {
      return
    }

    if (!hitsState.isLastPage) {
      // Not last page, load more items
      hitsState.showMore()
    } else if (nextStage === noMoreStage) {
      // All stages are loaded,
      // no more items to load
      // do nothing
    } else {
      // All items have been loaded.
      // Start to load next stage items.
      setStage(nextStage)
    }
  }, [hitsState, nextStage, setStage])

  // Auto-load next stage if current stage doesn't have enough items
  // This ensures the page has enough content to display
  useEffect(() => {
    if (hitsState?.items && hitsState.items.length < hitsPerPage) {
      load()
    }
  }, [load, hitsState])

  // Show "Load More" button if there are more results to load
  const hasMoreToLoad =
    hitsState?.results && (!hitsState.isLastPage || nextStage !== noMoreStage)

  if (hasMoreToLoad) {
    return (
      <LoadMoreBlock>
        <PillButton
          onClick={showLoadingIcon ? voidFunction : load}
          text="載入更多"
          style="dark"
          loading={showLoadingIcon}
        />
      </LoadMoreBlock>
    )
  }

  return null
}

export const Hits = ({
  className,
  indexName,
  query,
  filters,
}: {
  className?: string
  indexName: IndexName
  query?: string
  filters?: string
}) => {
  const searchClient = useMemo(createAlgoliaSearchClient, [])
  const containerRef = useRef<HTMLDivElement>(null)

  if (!searchClient) {
    // @TODO render placeholder
    return null
  }

  let ListComponent
  switch (indexName) {
    case indexNames.Legislator: {
      ListComponent = LegislatorHitsList
      break
    }
    case indexNames.Councilor: {
      ListComponent = CouncilorHitsList
      break
    }
    case indexNames.Topic: {
      ListComponent = TopicHitsList
      break
    }
    case indexNames.CouncilTopic: {
      ListComponent = CouncilTopicHitsList
      break
    }
    case indexNames.Speech: {
      ListComponent = SpeechHitsList
      break
    }
    case indexNames.CouncilBill: {
      ListComponent = CouncilBillHitsList
      break
    }
  }

  return (
    <Container ref={containerRef} className={className}>
      <InstantSearch
        indexName={indexName}
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: false,
        }}
      >
        <PrefillQuery query={query} />
        <EmptyResultChecker indexNames={[indexName]} />
        <Configure hitsPerPage={10} filters={filters} />
        <ListComponent />
        <LoadMore indexName={indexName} />
      </InstantSearch>
    </Container>
  )
}

const LoadMore = ({ indexName }: { indexName: IndexName }) => {
  const { renderState, status } = useInstantSearch()
  const hitsState = renderState[indexName]?.infiniteHits

  // Per [react-instantsearch docs](https://www.algolia.com/doc/api-reference/widgets/use-instantsearch/react/#widget-param-status):
  // show loading indicator only when status === 'stalled'
  const showLoadingIcon = status === instantSearchStatus.Stalled

  const load = () => {
    // infiniteHits is not ready
    if (!hitsState?.results) {
      return
    }

    if (!hitsState.isLastPage) {
      // Not last page, load more items
      hitsState.showMore()
    }
  }

  // There are more items to load
  if (hitsState?.results && !hitsState.isLastPage) {
    return (
      <LoadMoreBlock>
        <PillButton
          onClick={showLoadingIcon ? voidFunction : load}
          text="載入更多"
          style="dark"
          loading={showLoadingIcon}
        />
      </LoadMoreBlock>
    )
  }

  return null
}

const LegislatorHitsList = () => {
  const { items }: { items: LegislatorRawHit[] } = useInfiniteHits()

  const hitsJsx = items.map((hit, idx) => {
    return <LegislatorHit key={idx} hit={hit} />
  })

  return <>{hitsJsx}</>
}

const CouncilorHitsList = () => {
  const { items }: { items: CouncilorRawHit[] } = useInfiniteHits()

  const hitsJsx = items.map((hit, idx) => {
    return <CouncilorHit key={idx} hit={hit} />
  })

  return <>{hitsJsx}</>
}

const TopicHitsList = () => {
  const { items }: { items: TopicRawHit[] } = useInfiniteHits()

  const hitsJsx = items.map((hit, idx) => {
    return <TopicHit key={idx} hit={hit} />
  })

  return <>{hitsJsx}</>
}

const CouncilTopicHitsList = () => {
  const { items }: { items: CouncilTopicRawHit[] } = useInfiniteHits()

  const hitsJsx = items.map((hit, idx) => {
    return <CouncilTopicHit key={idx} hit={hit} />
  })

  return <>{hitsJsx}</>
}

const SpeechHitsList = () => {
  const { items }: { items: SpeechRawHit[] } = useInfiniteHits()

  const hitsJsx = items.map((hit, idx) => {
    return <SpeechHit key={idx} hit={hit} />
  })

  return <>{hitsJsx}</>
}

const CouncilBillHitsList = () => {
  const { items }: { items: CouncilBillRawHit[] } = useInfiniteHits()

  const hitsJsx = items.map((hit, idx) => {
    return <CouncilBillHit key={idx} hit={hit} />
  })

  return <>{hitsJsx}</>
}
