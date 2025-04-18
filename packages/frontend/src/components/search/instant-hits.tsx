import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useInView } from 'react-intersection-observer'
import type { LegislatorRawHit, TopicRawHit } from './instant-hit'
import { Search as IconSearch } from './icons'
import { InstantLegislatorHit, InstantTopicHit } from './instant-hit'
import {
  Configure,
  Index,
  useSearchBox,
  useInfiniteHits,
  useInstantSearch,
} from 'react-instantsearch'

const Container = styled.div`
  width: 100%;
  max-height: 320px;
  overflow: scroll;
  background-color: #fff;
  border-radius: 8px;
  padding: 8px 0;
  box-shadow: 0px 0px 24px 0px #0000001a;

  a {
    text-decoration: none;
  }
`

const FirstRow = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 16px 12px 16px;

  &:hover {
    background-color: #f1f1f1;
  }
`

const SearchIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e2e2;
  border-radius: 50%;
`

const SearchText = styled.div`
  color: #404040;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
`

const Rows = styled.div`
  border-top: 1px solid #cdcdcd;
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

enum SearchStageEnum {
  Legislator = 'legislator',
  Topic = 'topic',
}

enum IndexNameEnum {
  Legislator = 'legislator',
  Topic = 'topic',
}

export const defaultIndexName = IndexNameEnum.Legislator

export const InstantHits = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { query } = useSearchBox()
  const [stage, setStage] = useState(SearchStageEnum.Legislator)

  if (typeof query !== 'string' || query === '') {
    return null
  }

  return (
    <Container ref={containerRef} className={className}>
      {/* TODO: add href after search page is ready */}
      <a href="" target="_self">
        <FirstRow>
          <SearchIcon>
            <IconSearch />
          </SearchIcon>
          <SearchText>{query}</SearchText>
        </FirstRow>
      </a>
      <Rows>
        <Index indexName={defaultIndexName}>
          <Configure hitsPerPage={10} />
          <InstantLegislatorHits />
        </Index>
        {stage === SearchStageEnum.Topic && (
          <Index indexName={IndexNameEnum.Topic}>
            <Configure hitsPerPage={10} />
            <InstantTopicHits />
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
  stage: SearchStageEnum
  setStage: React.Dispatch<React.SetStateAction<SearchStageEnum>>
  containerRef: React.RefObject<HTMLDivElement | null>
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
  //  }
  const { renderState, status } = useInstantSearch()
  const { query } = useSearchBox()
  const { ref, inView } = useInView({
    threshold: 0,
    root: containerRef.current ?? null,
  })
  const [noMoreHits, setNoMoreHits] = useState(false)
  const isLoading = status === 'loading' || status === 'stalled'

  // Per [react-instantsearch docs](https://www.algolia.com/doc/api-reference/widgets/use-instantsearch/react/#widget-param-status):
  // show loading indicator only when status === 'stalled'
  const showLoadingIcon = status === 'stalled'

  // Reset when query changes
  useEffect(() => {
    setStage(SearchStageEnum.Legislator)
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
    // and then load Topic items after all Legislator items loaded.
    const load = () => {
      // In Legislator stage
      if (stage === SearchStageEnum.Legislator) {
        const legislatorState =
          renderState[IndexNameEnum.Legislator]?.infiniteHits
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
          // Start to load Topic items.
          setStage(SearchStageEnum.Topic)
        }
      }
      // In Topic stage
      else if (stage === SearchStageEnum.Topic) {
        const topicState = renderState[IndexNameEnum.Topic]?.infiniteHits
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
          // Stop auto-load more
          setNoMoreHits(true)
        }
      }
    }

    load()
  }, [inView, isLoading, renderState, stage, setStage])

  return (
    <div>
      <div ref={ref} style={{ height: '1px' }} />
      {showLoadingIcon && <LoadingSpinner />}
    </div>
  )
}

const InstantLegislatorHits = () => {
  const { items }: { items: LegislatorRawHit[] } = useInfiniteHits()

  const hitsJsx = items.map((hit, idx) => {
    return <InstantLegislatorHit key={idx} hit={hit} />
  })

  return <>{hitsJsx}</>
}

const InstantTopicHits = () => {
  const { items }: { items: TopicRawHit[] } = useInfiniteHits()

  const hitsJsx = items.map((hit, idx) => {
    return <InstantTopicHit key={idx} hit={hit} />
  })

  return <>{hitsJsx}</>
}
