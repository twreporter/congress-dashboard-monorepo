'use client'

import dynamic from 'next/dynamic'

import type { AlgoliaInstantSearchProps } from '@/components/search/instant-search'
import type { SearchPageProps } from '@/components/search/result-page/types'

const AlgoliaInstantSearch = dynamic<AlgoliaInstantSearchProps>(
  () =>
    import('@/components/search/instant-search').then(
      (mod) => mod.AlgoliaInstantSearch
    ),
  { ssr: false }
)

const SearchPage = dynamic<SearchPageProps>(
  () =>
    import('@/components/search/result-page/index').then(
      (mod) => mod.SearchPage
    ),
  { ssr: false }
)

function AlgoliaInstantSearchWrapper(props: AlgoliaInstantSearchProps) {
  return <AlgoliaInstantSearch {...props} />
}

function SearchPageWrapper(props: SearchPageProps) {
  return <SearchPage {...props} />
}

export {
  AlgoliaInstantSearchWrapper as AlgoliaInstantSearch,
  SearchPageWrapper as SearchPage,
}
