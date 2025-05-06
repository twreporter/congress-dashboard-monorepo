import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      'dev-lawmaker-storage.twreporter.org',
      'staging-lawmaker-storage.twreporter.org',
      'dev.twreporter.org',
      'staging.twreporter.org',
      'twreporter.org',
    ],
  },
}

export default nextConfig
