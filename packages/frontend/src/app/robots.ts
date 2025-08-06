import type { MetadataRoute } from 'next'

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

export default function robots(): MetadataRoute.Robots {
  if (releaseBranch === 'release') {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: '/private/',
      },
      sitemap: 'https://lawmaker.twreporter.org/sitemap.xml',
    }
  }
  // staging/dev: disallow all (noindex)
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  }
}
