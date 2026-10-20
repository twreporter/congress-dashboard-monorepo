import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'
import {
  MEMBER_SESSION_COOKIE,
  createMemberSession,
  memberSessionCookieOptions,
} from '@/app/api/_auth/member-session'
import { upsertMember } from './upsert-member'

const getGoApiUrl =
  process.env.NEXT_PUBLIC_TWREPORTER_API_URL ||
  'https://staging-go-api.twreporter.org'

type AccessTokenClaims = {
  user_id?: number
  email?: string
}

function decodeAccessToken(accessToken: string): AccessTokenClaims {
  const payload = accessToken.split('.')[1]
  if (!payload) return {}

  try {
    return JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8')
    ) as AccessTokenClaims
  } catch {
    return {}
  }
}

export async function POST(request: NextRequest) {
  const idToken = request.cookies.get('id_token')?.value

  if (!idToken) {
    return NextResponse.json(
      { status: 'fail', message: 'id_token cookie is required' },
      { status: 401 }
    )
  }

  try {
    const response = await fetch(`${getGoApiUrl}/v2/auth/token`, {
      method: 'POST',
      headers: {
        Cookie: `id_token=${encodeURIComponent(idToken)}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    const payload = await response.json()
    const accessToken = payload?.data?.jwt

    if (!response.ok || typeof accessToken !== 'string') {
      return NextResponse.json(
        { status: 'fail', message: 'Unable to exchange access token' },
        { status: response.status === 400 ? 401 : response.status }
      )
    }

    const claims = decodeAccessToken(accessToken)
    const userId =
      Number.isSafeInteger(claims.user_id) && (claims.user_id ?? 0) > 0
        ? String(claims.user_id)
        : undefined
    let name: string | undefined
    let email = claims.email

    if (userId) {
      try {
        const profileResponse = await fetch(
          `${getGoApiUrl}/v2/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Cookie: `id_token=${encodeURIComponent(idToken)}`,
            },
            cache: 'no-store',
          }
        )

        if (profileResponse.ok) {
          const profilePayload = await profileResponse.json()
          const firstName = profilePayload?.data?.first_name?.trim() || ''
          const lastName = profilePayload?.data?.last_name?.trim() || ''
          name = [firstName, lastName].filter(Boolean).join(' ') || undefined
          if (typeof profilePayload?.data?.email === 'string') {
            email = profilePayload.data.email || email
          }
        }
      } catch {
        // Authentication remains valid when optional profile data is unavailable.
      }
    }

    if (!userId || !email) {
      return NextResponse.json(
        { status: 'error', message: 'User identity is incomplete' },
        { status: 502 }
      )
    }

    try {
      await upsertMember(userId, email, name || email.split('@')[0])
    } catch (error) {
      logger.error({ err: error, userId }, 'Failed to sync member on login')
      return NextResponse.json(
        { status: 'error', message: 'Unable to sync member' },
        { status: 502 }
      )
    }

    // Member features are authorised by this session instead of the browser's
    // TWReporter token, which is only trusted here at login.
    const session = createMemberSession(userId)
    const result = NextResponse.json({
      accessToken,
      userId,
      email,
      name: name || email?.split('@')[0],
    })
    result.cookies.set(
      MEMBER_SESSION_COOKIE,
      session.token,
      memberSessionCookieOptions(session.maxAge)
    )
    return result
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Authentication service unavailable' },
      { status: 502 }
    )
  }
}
