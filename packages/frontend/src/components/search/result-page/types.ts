import type { SearchStage } from '@/components/search/constants'

export type SearchResultsProps = {
  className?: string
  query?: string
}

export type SearchPageProps = {
  query?: string
}

export type SearchTabItem = {
  label: string
  value: SearchStage
}
