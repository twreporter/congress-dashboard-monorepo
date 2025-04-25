import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      'dev-congress-dashboard-storage.twreporter.org',
      'staging-congress-dashboard-storage.twreporter.org',
      'dev.twreporter.org',
      'staging.twreporter.org',
      'twreporter.org',
    ],
  },
}

export default nextConfig
