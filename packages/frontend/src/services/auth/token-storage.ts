const AUTH_STORAGE_KEY = 'congress-dashboard-auth-token'

export type StoredAccessToken = {
  accessToken: string
  expiresAt: number
  userId?: string
  email?: string
  name?: string
}

export function readStoredAccessToken(): StoredAccessToken | null {
  try {
    const value = sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (!value) return null

    const parsed = JSON.parse(value) as Partial<StoredAccessToken>
    if (
      typeof parsed.accessToken !== 'string' ||
      typeof parsed.expiresAt !== 'number' ||
      (parsed.userId !== undefined && typeof parsed.userId !== 'string') ||
      (parsed.email !== undefined && typeof parsed.email !== 'string') ||
      (parsed.name !== undefined && typeof parsed.name !== 'string') ||
      parsed.expiresAt <= Math.floor(Date.now() / 1000) + 60
    ) {
      sessionStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }

    return parsed as StoredAccessToken
  } catch {
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function writeStoredAccessToken(token: StoredAccessToken) {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(token))
}

export function clearStoredAccessToken() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY)
}
