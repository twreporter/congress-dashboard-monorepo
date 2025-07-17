'use client'

import dynamic from 'next/dynamic'

import type { AlgoliaInstantSearchProps } from '@/components/search/instant-search'
import type { SearchResultsProps } from '@/components/search/result-page/index'

const AlgoliaInstantSearch = dynamic<AlgoliaInstantSearchProps>(
  () =>
    import('@/components/search/instant-search').then(
      (mod) => mod.AlgoliaInstantSearch
    ),
  { ssr: false }
)

const SearchResults = dynamic<SearchResultsProps>(
  () =>
    import('@/components/search/result-page/index').then(
      (mod) => mod.SearchResults
    ),
  { ssr: false }
)

function AlgoliaInstantSearchWrapper(props: AlgoliaInstantSearchProps) {
  return <AlgoliaInstantSearch {...props} />
}

function SearchResultsWrapper(props: SearchResultsProps) {
  return <SearchResults {...props} />
}

export {
  AlgoliaInstantSearchWrapper as AlgoliaInstantSearch,
  SearchResultsWrapper as SearchResults,
}
