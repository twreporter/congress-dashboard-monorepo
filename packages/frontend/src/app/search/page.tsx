export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
// components
import { SearchResults } from '@/components/search/index'
// constants
import { InternalRoutes } from '@/constants/routes'
import { OG_IMAGE_URL } from '@/constants'

export async function generateMetadata(): Promise<Metadata> {
  const title = '搜尋觀測站 - 報導者觀測站'
  const description = '報導者觀測站'
  const image = OG_IMAGE_URL
  return {
    title,
    description,
    alternates: {
      canonical: `https://lawmaker.twreporter.org${InternalRoutes.Search}`,
    },
    openGraph: {
      title,
      description,
      url: `https://lawmaker.twreporter.org${InternalRoutes.Search}`,
      type: 'article',
      images: image,
    },
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const { query } = await searchParams
  console.log({
    query,
  })
  return <SearchResults query={query} />
}
