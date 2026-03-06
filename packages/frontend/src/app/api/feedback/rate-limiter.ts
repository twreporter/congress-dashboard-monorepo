type RateLimitEntry = {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

const WINDOW_MS = 60 * 1000 // 1 minute window
const MAX_REQUESTS = 5 // max 5 requests per minute per IP
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000 // cleanup every 5 minutes

let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}

/**
 * Check if a given IP has exceeded the rate limit.
 * Uses an in-memory sliding window counter.
 */
export function isRateLimited(ip: string): boolean {
  cleanup()

  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    return false
  }

  entry.count++
  return entry.count > MAX_REQUESTS
}
