import type { NextConfig } from 'next'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import Path from 'path'

const nextConfig = (phase: string): NextConfig => ({
  output: 'standalone',
  // Include dependencies hoisted to the monorepo root in the standalone output.
  // Setting this during dev causes Turbopack to fail with "Next.js package not found".
  ...(phase === PHASE_PRODUCTION_BUILD && {
    outputFileTracingRoot: Path.join(__dirname, '../../'),
  }),
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
