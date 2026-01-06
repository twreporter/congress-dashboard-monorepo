import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
}

export default nextConfig
