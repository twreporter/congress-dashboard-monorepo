import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  InstantHits as _InstantHits,
  defaultIndexName,
} from '@/components/search/instant-hits'
import { InstantSearch, useSearchBox } from 'react-instantsearch'
import { SearchBox, LayoutVariants } from '@/components/search/search-box'
import type { LayoutVariant } from '@/components/search/search-box'
import { ZIndex } from '@/styles/z-index'
import { liteClient as algoliasearch } from 'algoliasearch/lite'

// TODO: move to constants file and read them from environment variables
const algoliaConfig = {
  appID: 'V2C76WIIQK',
  searchAPIKey: '7d7fdff9202f5e67c6435f9613be11d9',
}

const searchClient = algoliasearch(
  algoliaConfig.appID,
  algoliaConfig.searchAPIKey
)

export { LayoutVariants }

const Container = styled.div<{ $variant: LayoutVariant }>`
  /* TODO: remove box-sizing if global already defined */
  * {
    box-sizing: border-box;
  }

  position: relative;

  ${({ $variant }) => {
    // Set the z-index to avoid covering the header and being covered by the sticky bar.
    if ($variant === LayoutVariants.Default) {
      return `z-index: ${ZIndex.SearchBarInBody};`
    }
  }}

  width: 100%;

  /* TODO: add mobile styles */
`

const InstantHits = styled(_InstantHits)<{ $hide: boolean }>`
  position: absolute;
  ${({ $hide }) => {
    if ($hide) {
      return `display: none;`
    }
    return `display: block;`
  }}
`

const ClickOutsideWidget = ({
  containerRef,
  onClickOutside,
}: {
  containerRef: React.RefObject<HTMLElement | null>
  onClickOutside: () => void
}) => {
  const { query } = useSearchBox()

  useEffect(() => {
    if (query === '') {
      return
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClickOutside()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [containerRef, onClickOutside, query])

  return null
}

export const AlgoliaInstantSearch = ({
  className,
  variant = LayoutVariants.Default,
  autoFocus = false,
}: {
  className?: string
  variant?: LayoutVariant
  autoFocus?: boolean
}) => {
  const containerRef = useRef(null)
  const [focused, setFocused] = useState(true)

  return (
    <Container ref={containerRef} className={className} $variant={variant}>
      <InstantSearch indexName={defaultIndexName} searchClient={searchClient}>
        <SearchBox
          variant={variant}
          autoFocus={autoFocus}
          onFocus={() => {
            setFocused(true)
          }}
        />
        <InstantHits $hide={!focused} />
        <ClickOutsideWidget
          containerRef={containerRef}
          onClickOutside={() => {
            setFocused(false)
          }}
        />
      </InstantSearch>
    </Container>
  )
}
