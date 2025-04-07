import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      'dev-congress-dashboard-storage.twreporter.org',
      'staging-congress-dashboard-storage.twreporter.org',
      'picsum.photos',
    ],
  },
}

export default nextConfig
