import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  // Track only the current frontend subpkg as root to avoid generating a monorepo structure
  outputFileTracingRoot: __dirname,
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
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
