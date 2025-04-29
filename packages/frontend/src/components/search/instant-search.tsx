import React from 'react'
import styled from 'styled-components'
import { InstantHits as _InstantHits, defaultIndexName } from './instant-hits'
import { InstantSearch } from 'react-instantsearch'
import { SearchBox } from './search-box'
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

const Container = styled.div`
  /* TODO: remove box-sizing if global already defined */
  * {
    box-sizing: border-box;
  }

  position: relative;

  /* desktop styles */
  width: 560px;

  /* TODO: add mobile styles */
`

const InstantHits = styled(_InstantHits)`
  position: absolute;
  z-index: ${ZIndex.SearchBar};
`

export const AlgoliaInstantSearch = () => {
  return (
    <Container>
      <InstantSearch indexName={defaultIndexName} searchClient={searchClient}>
        <SearchBox />
        <InstantHits />
      </InstantSearch>
    </Container>
  )
}
