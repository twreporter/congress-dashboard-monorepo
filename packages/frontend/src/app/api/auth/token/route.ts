import { NextRequest, NextResponse } from 'next/server'

const getGoApiUrl = () =>
  process.env.NEXT_PUBLIC_TWREPORTER_API_URL ||
  'https://staging-go-api.twreporter.org'

export async function POST(request: NextRequest) {
  const idToken = request.cookies.get('id_token')?.value

  if (!idToken) {
    return NextResponse.json(
      { status: 'fail', message: 'id_token cookie is required' },
      { status: 401 }
    )
  }

  try {
    const response = await fetch(`${getGoApiUrl()}/v2/auth/token`, {
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

    return NextResponse.json({ accessToken })
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Authentication service unavailable' },
      { status: 502 }
    )
  }
}