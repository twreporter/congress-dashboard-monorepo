// types
import type { SitemapItem, SitemapItemWithCity } from '@/types'

const baseUrl = 'https://lawmaker.twreporter.org' as const

type Sitemap = {
  url: string
  lastModified: Date
}

export const generateSitemap = (route: string) => {
  return ({ slug, updatedAt }: SitemapItem): Sitemap => ({
    url: `${baseUrl}${route}/${slug}`,
    lastModified: new Date(updatedAt),
  })
}

export const generateCouncilNestedSitemap = (
  routeFn: (districtSlug: string) => string
) => {
  return ({ slug, city, updatedAt }: SitemapItemWithCity): Sitemap => ({
    url: `${baseUrl}${routeFn(city)}/${slug}`,
    lastModified: new Date(updatedAt),
  })
}
