import { NextResponse } from 'next/server'

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

  return response
}