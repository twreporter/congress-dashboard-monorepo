// constants
import { InternalRoutes } from '@/constants/routes'
// types
import type { SitemapItem, SitemapItemWithCity } from '@/types'

const baseUrl = 'https://lawmaker.twreporter.org' as const

type Sitemap = {
  url: string
  lastModified: Date
}

export const generateSitemap = (route: InternalRoutes) => {
  return ({ slug, updatedAt }: SitemapItem): Sitemap => ({
    url: `${baseUrl}${route}/${slug}`,
    lastModified: new Date(updatedAt),
  })
}

export const generateCouncilNestedSitemap = (route: InternalRoutes) => {
  return ({ slug, city, updatedAt }: SitemapItemWithCity): Sitemap => ({
    url: `${baseUrl}${InternalRoutes.Council}/${city}${route}/${slug}`,
    lastModified: new Date(updatedAt),
  })
}
