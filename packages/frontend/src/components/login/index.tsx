'use client'

import { useSearchParams } from 'next/navigation'

const nodeEnv = process.env.NODE_ENV
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const loginWidgetUrl =
  process.env.NEXT_PUBLIC_LOGIN_WIDGET_URL ||
  'https://staging-accounts.twreporter.org/signin-widget'

const defaultDestination =
  nodeEnv === 'development'
    ? 'http://localhost:3000'
    : releaseBranch === 'staging'
      ? 'https://staging-lawmaker.twreporter.org'
      : releaseBranch === 'dev'
        ? 'https://dev-lawmaker.twreporter.org'
        : 'https://lawmaker.twreporter.org'
const allowedDestinationOrigins = new Set([
  'https://lawmaker.twreporter.org',
  'https://dev-lawmaker.twreporter.org',
  'https://staging-lawmaker.twreporter.org',
])

function isAllowedDestination(url: URL) {
  if (allowedDestinationOrigins.has(url.origin)) return true

  return (
    nodeEnv === 'development' &&
    url.protocol === 'http:' &&
    (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
  )
}

function sanitizeDestination(rawDestination?: string): {
  destination: string
} {
  if (!rawDestination) {
    return { destination: defaultDestination }
  }

  try {
    const parsed = new URL(rawDestination)
    if (isAllowedDestination(parsed)) {
      return { destination: parsed.toString() }
    }
  } catch {
    // fall through to default destination
  }

  return { destination: defaultDestination }
}

function Login() {
  const searchParams = useSearchParams()
  const { destination } = sanitizeDestination(
    searchParams.get('destination') ?? undefined
  )
  const iframeSrc = `${loginWidgetUrl}?destination=${encodeURIComponent(destination)}`
  return (
    <iframe
      style={{ height: '100vh', width: '100vw' }}
      src={iframeSrc}
      title="Lawmaker Login widget"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  )
}

export default Login
