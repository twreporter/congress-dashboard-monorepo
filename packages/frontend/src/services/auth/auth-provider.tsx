'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  clearStoredAccessToken,
  readStoredAccessToken,
  writeStoredAccessToken,
} from './token-storage'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error'

type AccessTokenClaims = {
  user_id?: number
  email?: string
  exp?: number
}

type AuthContextValue = {
  accessToken?: string
  email?: string
  userId?: string
  status: AuthStatus
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function decodeClaims(accessToken: string): AccessTokenClaims {
  const payload = accessToken.split('.')[1]
  if (!payload) throw new Error('Invalid access token')

  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return JSON.parse(atob(padded)) as AccessTokenClaims
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string>()
  const [claims, setClaims] = useState<AccessTokenClaims>()
  const [status, setStatus] = useState<AuthStatus>('loading')

  const setAuthenticated = useCallback((token: string) => {
    const nextClaims = decodeClaims(token)
    if (typeof nextClaims.exp !== 'number') {
      throw new Error('Access token expiration is missing')
    }

    setAccessToken(token)
    setClaims(nextClaims)
    setStatus('authenticated')
    writeStoredAccessToken({ accessToken: token, expiresAt: nextClaims.exp })
  }, [])

  const exchangeToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        credentials: 'same-origin',
      })
      if (response.status === 401) {
        clearStoredAccessToken()
        setAccessToken(undefined)
        setClaims(undefined)
        setStatus('unauthenticated')
        return
      }
      if (!response.ok) throw new Error('Unable to exchange access token')

      const payload = (await response.json()) as { accessToken?: string }
      if (!payload.accessToken) throw new Error('Access token is missing')
      setAuthenticated(payload.accessToken)
    } catch {
      setStatus('error')
    }
  }, [setAuthenticated])

  useEffect(() => {
    const stored = readStoredAccessToken()
    if (stored) {
      try {
        setAuthenticated(stored.accessToken)
        return
      } catch {
        clearStoredAccessToken()
      }
    }

    exchangeToken()
  }, [exchangeToken, setAuthenticated])

  useEffect(() => {
    if (status !== 'authenticated' || typeof claims?.exp !== 'number') return

    const refreshInMs = Math.max(
      (claims.exp - Math.floor(Date.now() / 1000) - 60) * 1000,
      0
    )
    const refreshTimer = window.setTimeout(exchangeToken, refreshInMs)

    return () => window.clearTimeout(refreshTimer)
  }, [claims?.exp, exchangeToken, status])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      })
    } finally {
      clearStoredAccessToken()
      setAccessToken(undefined)
      setClaims(undefined)
      setStatus('unauthenticated')
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        email: claims?.email,
        userId:
          typeof claims?.user_id === 'number' ? String(claims.user_id) : undefined,
        status,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}