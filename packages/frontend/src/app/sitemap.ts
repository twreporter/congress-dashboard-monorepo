import type { MetadataRoute } from 'next'
// fetcher
import { fetchAllLegislatorsSlug } from '@/fetchers/server/legislator'
import { fetchAllSpeechesSlug } from '@/fetchers/server/speech'
import { fetchAllTopicsSlug } from '@/fetchers/server/topic'
// constants
import { InternalRoutes } from '@/constants/routes'
// utils
import { generateSitemap } from '@/utils/sitemap'

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const baseUrl = 'https://lawmaker.twreporter.org' as const

export const dynamic = 'force-dynamic'

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

    return baseSitemap.concat(
      legislatorSitemap ?? [],
      speechSitemap ?? [],
      topicSitemap ?? []
    )
  }
  return []
}
