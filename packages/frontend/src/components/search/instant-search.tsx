import React, { useEffect, useMemo, useRef, useState } from 'react'
import useWindowWidth from '@/hooks/use-window-width'
import styled from 'styled-components'
import type { LayoutVariant } from '@/components/search/constants'
import { DEFAULT_SCREEN } from '@twreporter/core/lib/utils/media-query'
import {
  InstantHits as _InstantHits,
  defaultIndexName,
} from '@/components/search/instant-hits'
import { InstantSearch, useSearchBox } from 'react-instantsearch'
import { LayoutVariants } from '@/components/search/constants'
import { SearchBox } from '@/components/search/search-box'
import { SearchModal } from '@/components/search/modal'
import { ZIndex } from '@/styles/z-index'
import { liteClient as algoliasearch } from 'algoliasearch/lite'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const windowWidth = useWindowWidth()

  const searchClient = useMemo(() => {
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
  }, [])

  if (!searchClient) {
    return null // Avoid render if client not ready
  }

  if (isModalOpen) {
    return (
      <InstantSearch indexName={defaultIndexName} searchClient={searchClient}>
        <SearchModal
          onClose={() => {
            setIsModalOpen(false)
          }}
        />
      </InstantSearch>
    )
  }

  return (
    <InstantSearch indexName={defaultIndexName} searchClient={searchClient}>
      <Container ref={containerRef} className={className} $variant={variant}>
        <SearchBox
          variant={variant}
          autoFocus={autoFocus}
          onFocus={() => {
            setFocused(true)

            // For mobile, open the search modal
            if (windowWidth < DEFAULT_SCREEN.tablet.minWidth) {
              setIsModalOpen(true)
            }
          }}
        />
        <InstantHits $hide={!focused} />
        <ClickOutsideWidget
          containerRef={containerRef}
          onClickOutside={() => {
            setFocused(false)
          }}
        />
      </Container>
    </InstantSearch>
  )
}
