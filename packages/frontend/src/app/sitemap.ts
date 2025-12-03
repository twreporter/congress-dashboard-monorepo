import type { MetadataRoute } from 'next'
// fetcher
import { fetchAllLegislatorsSlug } from '@/fetchers/server/legislator'
import { fetchAllSpeechesSlug } from '@/fetchers/server/speech'
import { fetchAllTopicsSlug } from '@/fetchers/server/topic'
import { fetchAllCouncilBillsSlug } from '@/fetchers/server/council-bill'
// constants
import { InternalRoutes } from '@/constants/routes'
// types
import type { SitemapItem } from '@/types'

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const baseUrl = 'https://lawmaker.twreporter.org' as const

export const dynamic = 'force-dynamic'

const generateSitemap = (route: InternalRoutes) => {
  return ({
    slug,
    updatedAt,
  }: SitemapItem): { url: string; lastModified: Date } => ({
    url: `${baseUrl}${route}/${slug}`,
    lastModified: new Date(updatedAt),
  })
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (releaseBranch === 'release') {
    const baseSitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}${InternalRoutes.About}`,
        lastModified: new Date(),
      },
    ]
    const legislators = await fetchAllLegislatorsSlug()
    const legislatorSitemap = legislators?.map(
      generateSitemap(InternalRoutes.Legislator)
    )

    const speeches = await fetchAllSpeechesSlug()
    const speechSitemap = speeches?.map(generateSitemap(InternalRoutes.Speech))

    const topics = await fetchAllTopicsSlug()
    const topicSitemap = topics?.map(generateSitemap(InternalRoutes.Topic))

    const bills = await fetchAllCouncilBillsSlug()
    const billSitemap = bills?.map(generateSitemap(InternalRoutes.Bill))

    return baseSitemap.concat(
      legislatorSitemap ?? [],
      speechSitemap ?? [],
      topicSitemap ?? [],
      billSitemap ?? []
    )
  }
  return []
}
