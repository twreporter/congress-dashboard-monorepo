import React from 'react'
import styled from 'styled-components'
import {
  InstantHits as _InstantHits,
  defaultIndexName,
} from '@/components/search/instant-hits'
import { InstantSearch } from 'react-instantsearch'
import { SearchBox, layoutVariants } from '@/components/search/search-box'
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

export { layoutVariants }

const Container = styled.div<{ $variant: LayoutVariant }>`
  /* TODO: remove box-sizing if global already defined */
  * {
    box-sizing: border-box;
  }

  position: relative;

  ${({ $variant }) => {
    // Set the z-index to avoid covering the header and being covered by the sticky bar.
    if ($variant === layoutVariants.Default) {
      return `z-index: ${ZIndex.SearchBarInBody};`
    }
  }}

  width: 100%;

  /* TODO: add mobile styles */
`

const InstantHits = styled(_InstantHits)`
  position: absolute;
`

export const AlgoliaInstantSearch = ({
  className,
  variant = layoutVariants.Default,
}: {
  className?: string
  variant?: LayoutVariant
}) => {
  return (
    <Container className={className} $variant={variant}>
      <InstantSearch indexName={defaultIndexName} searchClient={searchClient}>
        <SearchBox variant={variant} />
        <InstantHits />
      </InstantSearch>
    </Container>
  )
}
