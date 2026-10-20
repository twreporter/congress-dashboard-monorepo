import { NextResponse } from 'next/server'
import { MEMBER_SESSION_COOKIE } from '@/app/api/_auth/member-session'

export async function POST() {
  const response = NextResponse.json({ status: 'success' })

  for (const name of ['id_token', 'activated']) {
    response.cookies.set(name, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      expires: new Date(0),
      path: '/',
      domain:
        process.env.NODE_ENV === 'production' ? '.twreporter.org' : undefined,
    })
  }

  // Host-only, so it is cleared without the shared TWReporter cookie domain.
  response.cookies.set(MEMBER_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    expires: new Date(0),
    path: '/',
  })

  return response
}
