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
  serverExternalPackages: ['pino', 'pino-pretty'],
}

export default nextConfig
