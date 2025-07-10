'use client'

import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import type { IndexName, SearchStage } from '@/components/search/constants'
import styled from 'styled-components'
import { searchStages, indexNames } from '@/components/search/constants'
import type {
  LegislatorRawHit,
  TopicRawHit,
  SpeechRawHit,
} from '@/components/search/result-page/hit'
import {
  LegislatorHit,
  TopicHit,
  SpeechHit,
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
import { liteClient as algoliasearch } from 'algoliasearch/lite'

const hitsPerPage = 10

const InstantSearchStatus = {
  Idle: 'idle',
  Loading: 'loading',
  Stalled: 'stalled',
  Error: 'error',
} as const

const Container = styled.div`
  width: 100%;

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

function createAlgoliaSearchClient() {
  if (typeof window === 'undefined') {
    return null // Don't init on server
  }

  const appID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
  const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY

  if (!appID || !searchKey) {
    console.warn('Missing Algolia credentials')
    return null
  }

  return algoliasearch(appID, searchKey)
}

function PrefillQuery({ query }: { query?: string }) {
  const { refine } = useSearchBox()

  useEffect(() => {
    refine(query ?? '')
  }, [refine, query])

  return null
}

/**
 * Renders Algolia hits from multiple <Index> components
 * in a progressive staged order: Legislator → Topic → Speech
 */
export const MultiStageHits = ({
  className,
  query,
}: {
  className?: string
  query?: string
}) => {
  const searchClient = useMemo(createAlgoliaSearchClient, [])
  const containerRef = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState<SearchStage>(searchStages.Legislator)

  if (!searchClient) {
    // @TODO render placeholder
    return null
  }

  return (
    <Container ref={containerRef} className={className}>
      <InstantSearch
        indexName={indexNames.Legislator}
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <Index indexName={indexNames.Legislator}>
          <PrefillQuery query={query} />
          <Configure hitsPerPage={hitsPerPage} />
          <LegislatorHitsList />
        </Index>
        {(stage === searchStages.Topic || stage === searchStages.Speech) && (
          <Index indexName={indexNames.Topic}>
            <PrefillQuery query={query} />
            <Configure hitsPerPage={hitsPerPage} />
            <TopicHitsList />
          </Index>
        )}
        {stage === searchStages.Speech && (
          <Index indexName={indexNames.Speech}>
            <PrefillQuery query={query} />
            <Configure hitsPerPage={hitsPerPage} />
            <SpeechHitsList />
          </Index>
        )}
        <LoadMoreBlock>
          <LoadMoreForStages stage={stage} setStage={setStage} />
        </LoadMoreBlock>
      </InstantSearch>
    </Container>
  )
}

const noMoreStage = 'no_more_stage' as const

const voidFunction = () => {}

const stageConfig = {
  [searchStages.Legislator]: {
    indexName: indexNames.Legislator,
    nextStage: searchStages.Topic,
  },
  [searchStages.Topic]: {
    indexName: indexNames.Topic,
    nextStage: searchStages.Speech,
  },
  [searchStages.Speech]: {
    indexName: indexNames.Speech,
    nextStage: noMoreStage,
  },
}

const LoadMoreForStages = ({
  stage,
  setStage,
}: {
  stage: SearchStage
  setStage: React.Dispatch<React.SetStateAction<SearchStage>>
}) => {
  // `renderState` structure from multiple <Index> components:
  //  {
  //    // legislator index
  //    legislator: {
  //      // To see all properties of `inifiniteHits`, see [docs here](https://www.algolia.com/doc/api-reference/widgets/infinite-hits/react/#hook-api).
  //      inifiniteHits: {
  //        isLastPage: false,
  //        items: [],
  //        hits: [],
  //        results: undefined,
  //        showMore: () => { ... },
  //      },
  //    },
  //    // topic index
  //    topic: {
  //      inifiniteHits: {
  //        isLastPage: false,
  //        items: [],
  //        hits: [],
  //        results: undefined,
  //        showMore: () => { ... },
  //      },
  //    },
  //    // speech index
  //    speech: {
  //      inifiniteHits: {
  //        isLastPage: false,
  //        items: [],
  //        hits: [],
  //        results: undefined,
  //        showMore: () => { ... },
  //      },
  //    }
  //  }
  const { renderState, status } = useInstantSearch()

  // Per [react-instantsearch docs](https://www.algolia.com/doc/api-reference/widgets/use-instantsearch/react/#widget-param-status):
  // show loading indicator only when status === 'stalled'
  const showLoadingIcon = status === InstantSearchStatus.Stalled

  const { indexName, nextStage } = stageConfig[stage]
  const hitsState = renderState[indexName]?.infiniteHits

  // We load Legislator items first,
  // and then load Topic items after all Legislator items loaded,
  // and finally load Speech items after all Topic items loaded.
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
  }, [hitsState, nextStage])

  // If loaded items in the stage is not enough `${hitsPerPage}` records,
  // try to load more.
  useEffect(() => {
    if (hitsState?.items && hitsState.items.length < hitsPerPage) {
      load()
    }
  }, [load, hitsState])

  if (
    // There are more hits to load
    hitsState?.results &&
    !hitsState.isLastPage
  ) {
    return (
      <PillButton
        onClick={showLoadingIcon ? voidFunction : load}
        text="載入更多"
        style="dark"
        loading={showLoadingIcon}
      />
    )
  }

  // No more items to load
  return null
}

export const Hits = ({
  className,
  indexName,
  query,
}: {
  className?: string
  indexName: IndexName
  query?: string
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
    case indexNames.Topic: {
      ListComponent = TopicHitsList
      break
    }
    case indexNames.Speech: {
      ListComponent = SpeechHitsList
      break
    }
  }

  return (
    <Container ref={containerRef} className={className}>
      <InstantSearch
        indexName={indexName}
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <PrefillQuery query={query} />
        <Configure hitsPerPage={10} />
        <ListComponent />
        <LoadMoreBlock>
          <LoadMore indexName={indexName} />
        </LoadMoreBlock>
      </InstantSearch>
    </Container>
  )
}

const LoadMore = ({ indexName }: { indexName: IndexName }) => {
  const { renderState, status } = useInstantSearch()
  const hitsState = renderState[indexName]?.infiniteHits

  // Per [react-instantsearch docs](https://www.algolia.com/doc/api-reference/widgets/use-instantsearch/react/#widget-param-status):
  // show loading indicator only when status === 'stalled'
  const showLoadingIcon = status === InstantSearchStatus.Stalled

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
      <PillButton
        onClick={showLoadingIcon ? voidFunction : load}
        text="載入更多"
        style="dark"
        loading={showLoadingIcon}
      />
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

const TopicHitsList = () => {
  const { items }: { items: TopicRawHit[] } = useInfiniteHits()

  const hitsJsx = items.map((hit, idx) => {
    return <TopicHit key={idx} hit={hit} />
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
