import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import type { LayoutVariant, SearchStage } from '@/components/search/constants'
import {
  layoutVariants,
  indexNames,
  searchStages,
} from '@/components/search/constants'
import { useInView } from 'react-intersection-observer'
import type {
  LegislatorRawHit,
  TopicRawHit,
  CouncilorRawHit,
  CouncilTopicRawHit,
} from '@/components/search/instant-hit'
import { Search as IconSearch } from '@/components/search/icons'
import {
  InstantLegislatorHit,
  InstantTopicHit,
  InstantCouncilorHit,
  InstantCouncilTopicHit,
} from '@/components/search/instant-hit'
import {
  Configure,
  Index,
  useSearchBox,
  useInfiniteHits,
  useInstantSearch,
} from 'react-instantsearch'
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import { InternalRoutes } from '@/constants/routes'
import { instantSearchStatus } from '@/components/search/constants'

const Container = styled.div<{ $variant: LayoutVariant }>`
  width: 100%;
  overflow: scroll;
  background-color: ${colorGrayscale.white};

  ${({ $variant }) => {
    switch ($variant) {
      case layoutVariants.Modal: {
        return `
          height: 100%;
        `
      }
      case layoutVariants.Header:
      case layoutVariants.Default:
      default: {
        return `
          border-radius: 8px;
          padding: 8px 0;
          margin-top: 8px;
          box-shadow: 0px 0px 24px 0px ${colorOpacity['black_0.1']};

          max-height: 320px;
        `
      }
    }
  }}
  a {
    text-decoration: none;
  }
`

const FirstRow = styled.div<{ $variant: LayoutVariant }>`
  display: flex;
  align-items: center;
  gap: 12px;
  ${({ $variant }) => {
    switch ($variant) {
      case layoutVariants.Modal: {
        return `
          padding: 8px 24px;
        `
      }
      default: {
        return `
          padding: 8px 16px;
        `
      }
    }
  }}
  margin: 4px 0;

  /**
    * @TODO: add back when search page is ready
    *
  &:hover {
    background-color: ${colorGrayscale.gray100};
  }
  */
`

const SearchIconContainer = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${colorGrayscale.gray200};
  border-radius: 50%;
`

const SearchText = styled.div`
  color: ${colorGrayscale.gray800};
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
`

const Rows = styled.div`
  &:not(:empty) {
    border-top: 1px solid ${colorGrayscale.gray300};
  }
`

// TODO: replace loading indicator after design ready
const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px;

  &::after {
    content: '';
    width: 16px;
    height: 16px;
    border: 2px solid #999;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export const defaultIndexName = indexNames.Legislator

export const InstantHits = ({
  className,
  variant = layoutVariants.Default,
}: {
  className?: string
  variant?: LayoutVariant
}) => {
  const stageOrder: SearchStage[] = [
    searchStages.Legislator,
    searchStages.Councilor,
    searchStages.Topic,
    searchStages.CouncilTopic,
  ]
  const hasReached = (current: SearchStage, target: SearchStage) => {
    return stageOrder.indexOf(current) >= stageOrder.indexOf(target)
  }
  const containerRef = useRef<HTMLDivElement>(null)
  const { query } = useSearchBox()
  const [stage, setStage] = useState<SearchStage>(searchStages.Legislator)

  if (typeof query !== 'string' || query === '') {
    return null
  }

  return (
    <Container ref={containerRef} className={className} $variant={variant}>
      {/*  use <a> to force full reload */}
      <a href={`${InternalRoutes.Search}?query=${query.split(' ').join('+')}`}>
        <FirstRow $variant={variant}>
          <SearchIconContainer>
            <IconSearch />
          </SearchIconContainer>
          <SearchText>{query}</SearchText>
        </FirstRow>
      </a>
      <Rows>
        <Index indexName={defaultIndexName}>
          <Configure hitsPerPage={10} />
          <InstantLegislatorHits variant={variant} />
        </Index>
        {hasReached(stage, searchStages.Councilor) && (
          <Index indexName={indexNames.Councilor}>
            <Configure hitsPerPage={10} />
            <InstantCouncilorHits variant={variant} />
          </Index>
        )}
        {hasReached(stage, searchStages.Topic) && (
          <Index indexName={indexNames.Topic}>
            <Configure hitsPerPage={10} />
            <InstantTopicHits variant={variant} />
          </Index>
        )}
        {hasReached(stage, searchStages.CouncilTopic) && (
          <Index indexName={indexNames.CouncilTopic}>
            <Configure hitsPerPage={10} />
            <InstantCouncilTopicHits variant={variant} />
          </Index>
        )}
      </Rows>
      <LoadMore stage={stage} setStage={setStage} containerRef={containerRef} />
    </Container>
  )
}

const LoadMore = ({
  stage,
  setStage,
  containerRef,
}: {
  stage: SearchStage
  setStage: React.Dispatch<React.SetStateAction<SearchStage>>
  containerRef: React.RefObject<HTMLDivElement | null>
}) => {
  // `renderState` structure from multiple <Index> components:
  //  {
  //    // legislator index
  //    legislator: {
  //      // To see all properties of `infiniteHits`, see [docs here](https://www.algolia.com/doc/api-reference/widgets/infinite-hits/react/#hook-api).
  //      infiniteHits: {
  //        isLastPage: false,
  //        items: [],
  //        hits: [],
  //        results: undefined,
  //        showMore: () => { ... },
  //      },
  //    },
  //    // topic index
  //    topic: {
  //      infiniteHits: {
  //        isLastPage: false,
  //        items: [],
  //        hits: [],
  //        results: undefined,
  //        showMore: () => { ... },
  //      },
  //    },
  //    // councilor index
  //    councilor: {
  //      infiniteHits: {
  //        isLastPage: false,
  //        items: [],
  //        hits: [],
  //        results: undefined,
  //        showMore: () => { ... },
  //      },
  //    },
  //    // council-topic index
  //    'council-topic': {
  //      infiniteHits: {
  //        isLastPage: false,
  //        items: [],
  //        hits: [],
  //        results: undefined,
  //        showMore: () => { ... },
  //      },
  //    },
  //  }
  const { renderState, status } = useInstantSearch()
  const { query } = useSearchBox()
  const { ref, inView } = useInView({
    threshold: 0,
    root: containerRef.current ?? null,
  })
  const [noMoreHits, setNoMoreHits] = useState(false)
  const isLoading =
    status === instantSearchStatus.Loading ||
    status === instantSearchStatus.Stalled

  // Per [react-instantsearch docs](https://www.algolia.com/doc/api-reference/widgets/use-instantsearch/react/#widget-param-status):
  // show loading indicator only when status === 'stalled'
  const showLoadingIcon = status === instantSearchStatus.Stalled

  // Reset when query changes
  useEffect(() => {
    setStage(searchStages.Legislator)
    setNoMoreHits(false)
  }, [query, setStage])

  // Auto-load more based on inView and current stage
  useEffect(() => {
    if (!inView || isLoading || noMoreHits) {
      // There is no need to load more items,
      // so do nothing
      return
    }

    // We load Legislator items first,
    // then Councilor items, then Topic items, and finally CouncilTopic items.
    const load = () => {
      // In Legislator stage
      if (stage === searchStages.Legislator) {
        const legislatorState = renderState[indexNames.Legislator]?.infiniteHits
        // Legislator infiniteHits is not ready
        if (!legislatorState || !legislatorState.results) {
          // Do nothing
          return
        }

        // Ensure the results belong to the current query before proceeding
        if (legislatorState.results.query !== query) {
          return
        }

        if (!legislatorState.isLastPage) {
          // Not last page, load more Legislator items
          legislatorState.showMore()
        } else {
          // All Legislator items have been loaded.
          // Start to load Councilor items.
          setStage(searchStages.Councilor)
        }
      }
      // In Councilor stage
      else if (stage === searchStages.Councilor) {
        const councilorState = renderState[indexNames.Councilor]?.infiniteHits
        // Councilor infiniteHits is not ready
        if (!councilorState || !councilorState.results) {
          // Do nothing
          return
        }

        // Ensure the results belong to the current query before proceeding
        if (councilorState.results.query !== query) {
          return
        }

        if (!councilorState?.isLastPage) {
          // Not last page, load more Councilor items
          councilorState.showMore()
        } else {
          // All Councilor items have been loaded.
          // Start to load Topic items.
          setStage(searchStages.Topic)
        }
      }
      // In Topic stage
      else if (stage === searchStages.Topic) {
        const topicState = renderState[indexNames.Topic]?.infiniteHits
        // Topic infiniteHits is not ready
        if (!topicState || !topicState.results) {
          // Do nothing
          return
        }

        // Ensure the results belong to the current query before proceeding
        if (topicState.results.query !== query) {
          return
        }

        if (!topicState?.isLastPage) {
          // Not last page, load more Topic items
          topicState.showMore()
        } else {
          // All Topic items have been loaded.
          // Start to load CouncilTopic items.
          setStage(searchStages.CouncilTopic)
        }
      }
      // In CouncilTopic stage
      else if (stage === searchStages.CouncilTopic) {
        const councilTopicState =
          renderState[indexNames.CouncilTopic]?.infiniteHits
        // CouncilTopic infiniteHits is not ready
        if (!councilTopicState || !councilTopicState.results) {
          // Do nothing
          return
        }

        // Ensure the results belong to the current query before proceeding
        if (councilTopicState.results.query !== query) {
          return
        }

        if (!councilTopicState?.isLastPage) {
          // Not last page, load more CouncilTopic items
          councilTopicState.showMore()
        } else {
          // Stop auto-load more
          setNoMoreHits(true)
        }
      }
    }

    load()
  }, [query, inView, isLoading, renderState, stage, setStage, noMoreHits])

  return (
    <div>
      <div ref={ref} style={{ height: '1px' }} />
      {showLoadingIcon && <LoadingSpinner />}
    </div>
  )
}

const InstantLegislatorHits = ({ variant }: { variant: LayoutVariant }) => {
  const { items }: { items: LegislatorRawHit[] } = useInfiniteHits()

  const hitsJsx = items.map((hit) => {
    return (
      <InstantLegislatorHit key={hit.objectID} hit={hit} variant={variant} />
    )
  })

  return <>{hitsJsx}</>
}

const InstantTopicHits = ({ variant }: { variant: LayoutVariant }) => {
  const { items }: { items: TopicRawHit[] } = useInfiniteHits()

  const hitsJsx = items.map((hit) => {
    return <InstantTopicHit key={hit.objectID} hit={hit} variant={variant} />
  })

  return <>{hitsJsx}</>
}

const InstantCouncilorHits = ({ variant }: { variant: LayoutVariant }) => {
  const { items }: { items: CouncilorRawHit[] } = useInfiniteHits()

  const hitsJsx = items.map((hit) => {
    return (
      <InstantCouncilorHit key={hit.objectID} hit={hit} variant={variant} />
    )
  })

  return <>{hitsJsx}</>
}

const InstantCouncilTopicHits = ({ variant }: { variant: LayoutVariant }) => {
  const { items }: { items: CouncilTopicRawHit[] } = useInfiniteHits()

  const hitsJsx = items.map((hit) => {
    return (
      <InstantCouncilTopicHit key={hit.objectID} hit={hit} variant={variant} />
    )
  })

  return <>{hitsJsx}</>
}
