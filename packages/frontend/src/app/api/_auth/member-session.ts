import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Member features are authenticated with a session issued by this service
 * after the TWReporter identity has been verified once at login. The browser
 * token is therefore only trusted while logging in, and member requests do not
 * have to be re-validated against the TWReporter API on every call.
 */
export const MEMBER_SESSION_COOKIE = 'member_session'

const TTL_SECONDS = 60 * 60 * 24

type MemberSession = { userId: string; exp: number }

const signingKey = () => {
  const secret = process.env.MEMBER_SESSION_SECRET
  if (!secret) throw new Error('MEMBER_SESSION_SECRET is not configured')
  return secret
}

const sign = (data: string) =>
  createHmac('sha256', signingKey()).update(data).digest('base64url')

export function createMemberSession(userId: string) {
  const session: MemberSession = {
    userId,
    exp: Math.floor(Date.now() / 1000) + TTL_SECONDS,
  }
  const data = Buffer.from(JSON.stringify(session)).toString('base64url')
  return { token: `${data}.${sign(data)}`, maxAge: TTL_SECONDS }
}

export function readMemberSession(token?: string): string | undefined {
  if (!token) return undefined

  const [data, signature] = token.split('.')
  if (!data || !signature) return undefined

  const expected = Buffer.from(sign(data))
  const received = Buffer.from(signature)
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return undefined
  }

  let session: MemberSession
  try {
    session = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'))
  } catch {
    return undefined
  }
  if (
    typeof session.userId !== 'string' ||
    !/^[1-9]\d*$/.test(session.userId)
  ) {
    return undefined
  }
  if (typeof session.exp !== 'number' || session.exp * 1000 <= Date.now()) {
    return undefined
  }
  return session.userId
}

export const memberSessionCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge,
})
