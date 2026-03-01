import type { NextConfig } from 'next'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'

const nextConfig = (phase: string): NextConfig => ({
  output: 'standalone',
  // outputFileTracingRoot is only needed during build to avoid generating monorepo folder structure.
  // Setting it during dev causes Turbopack to fail with "Next.js package not found".
  ...(phase === PHASE_PRODUCTION_BUILD && { outputFileTracingRoot: __dirname }),

  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      'dev-lawmaker.twreporter.org',
      'staging-lawmaker.twreporter.org',
      'lawmaker.twreporter.org',
      'dev.twreporter.org',
      'staging.twreporter.org',
      'twreporter.org',
      'dev-lawmaker-storage.twreporter.org',
      'staging-lawmaker-storage.twreporter.org',
      'lawmaker-storage.twreporter.org',
      'picsum.photos',
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/congress',
        permanent: true,
      },
      {
        source: '/lawmaker/:slug*',
        destination: '/congress/lawmaker/:slug*',
        permanent: true,
      },
      {
        source: '/topics/:slug*',
        destination: '/congress/topic/:slug*',
        permanent: true,
      },
      {
        source: '/a/:slug*',
        destination: '/congress/a/:slug*',
        permanent: true,
      },
    ]
  },
})

export default nextConfig
