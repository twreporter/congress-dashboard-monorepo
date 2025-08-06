import type { MetadataRoute } from 'next'
// fetcher
import { fetchAllLegislatorsSlug } from '@/fetchers/server/legislator'
import { fetchAllSpeechesSlug } from '@/fetchers/server/speech'
import { fetchAllTopicsSlug } from '@/fetchers/server/topic'
// constants
import { InternalRoutes } from '@/constants/routes'

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const baseUrl = 'https://lawmaker.twreporter.org'

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
    const legislatorSitemap = legislators?.map(({ slug }) => ({
      url: `${baseUrl}${InternalRoutes.Legislator}/${slug}`,
      lastModified: new Date(),
    }))
    const speeches = await fetchAllSpeechesSlug()
    const speechSitemap = speeches?.map(({ slug }) => ({
      url: `${baseUrl}${InternalRoutes.Speech}/${slug}`,
      lastModified: new Date(),
    }))
    const topics = await fetchAllTopicsSlug()
    const topicSitemap = topics?.map(({ slug }) => ({
      url: `${baseUrl}${InternalRoutes.Topic}/${slug}`,
      lastModified: new Date(),
    }))
    return baseSitemap.concat(
      legislatorSitemap ?? [],
      speechSitemap ?? [],
      topicSitemap ?? []
    )
  }
  return []
}
