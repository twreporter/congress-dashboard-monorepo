import type { MetadataRoute } from 'next'
// fetcher
import { fetchAllCouncilBillsSlug } from '@/fetchers/server/council-bill'
import { fetchAllCouncilTopicSlug } from '@/fetchers/server/council-topic'
import { fetchAllCouncilorSlug } from '@/fetchers/server/councilor'
// constants
import { InternalRoutes } from '@/constants/routes'
// utils
import { generateSitemap, generateCouncilNestedSitemap } from '@/utils/sitemap'

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (releaseBranch === 'release') {
    const baseSitemap: MetadataRoute.Sitemap = []

    const bills = await fetchAllCouncilBillsSlug()
    const billSitemap = bills?.map(generateSitemap(InternalRoutes.Bill))

    const topics = await fetchAllCouncilTopicSlug()
    const topicSitemap = topics?.map(
      generateCouncilNestedSitemap(InternalRoutes.CouncilTopic)
    )

    const councilors = await fetchAllCouncilorSlug()
    const councilorSitemap = councilors?.map(
      generateCouncilNestedSitemap(InternalRoutes.Councilor)
    )

    return baseSitemap.concat(
      billSitemap ?? [],
      topicSitemap ?? [],
      councilorSitemap ?? []
    )
  }
  return []
}
