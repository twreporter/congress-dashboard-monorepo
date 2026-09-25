import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'
import {
  authenticatedUserId,
  createComboFavorite,
  deleteComboFavorite,
  getCombo,
  isTopicLegislator,
  listComboFavorites,
  resolveComboKey,
  validSource,
  type Combo,
} from '../../_combo'

type Context = { params: Promise<{ combo: string }> }

const fail = (status: number, message: string) =>
  NextResponse.json({ status: 'error', message }, { status })

const keyParams = (combo: Combo) =>
  isTopicLegislator(combo)
    ? ['topicSlug', 'legislatorSlug', 'meetingTerm']
    : ['councilTopicSlug', 'councilorSlug', 'city']

const readSearchParams = (combo: Combo, request: NextRequest) => {
  const input: Record<string, unknown> = {}
  for (const name of keyParams(combo)) {
    const value = request.nextUrl.searchParams.get(name)
    if (value !== null) input[name] = value
  }
  return input
}

export async function GET(request: NextRequest, { params }: Context) {
  const combo = getCombo((await params).combo)
  if (!combo) return fail(400, 'Invalid favorite combination')

  try {
    const { userId } = await authenticatedUserId(request)
    if (!userId) return fail(401, 'Unauthorized')

    const take = request.nextUrl.searchParams.get('take') ?? '50'
    const skip = request.nextUrl.searchParams.get('skip') ?? '0'
    if (
      !/^\d+$/.test(take) ||
      !/^\d+$/.test(skip) ||
      Number(take) < 1 ||
      Number(take) > 100
    ) {
      return fail(400, 'Invalid pagination')
    }

    // Supplying the full key turns this into an "is it saved?" lookup.
    const input = readSearchParams(combo, request)
    let key
    if (Object.keys(input).length === keyParams(combo).length) {
      const resolved = await resolveComboKey(combo, input)
      if ('error' in resolved) return fail(400, resolved.error)
      key = resolved.key
    }

    const favorites = await listComboFavorites(combo, userId, {
      key,
      take: Number(take),
      skip: Number(skip),
    })
    return NextResponse.json(
      { status: 'success', data: favorites },
      { headers: { 'Cache-Control': 'private, no-store' } }
    )
  } catch (error) {
    logger.error({ err: error }, 'Failed to list combo favorites')
    return fail(502, 'Unable to load favorites')
  }
}

export async function POST(request: NextRequest, { params }: Context) {
  const combo = getCombo((await params).combo)
  if (!combo) return fail(400, 'Invalid favorite combination')
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return fail(403, 'Invalid origin')
  }

  try {
    const { userId } = await authenticatedUserId(request)
    if (!userId) return fail(401, 'Unauthorized')

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return fail(400, 'Invalid JSON body')
    }
    if (body === null || typeof body !== 'object') {
      return fail(400, 'Invalid JSON body')
    }
    const input = body as Record<string, unknown>
    if (!validSource(combo, input.source)) return fail(400, 'Invalid source')

    const resolved = await resolveComboKey(combo, input)
    if ('error' in resolved) return fail(400, resolved.error)

    if (!(await resolved.validate())) {
      return fail(422, 'The pair has no record in this term')
    }

    const existing = await listComboFavorites(combo, userId, {
      key: resolved.key,
    })
    if (existing.length) {
      return NextResponse.json({ status: 'success', data: existing[0] })
    }

    const source = (input.source as string) ?? combo.sources[0]
    try {
      const favorite = await createComboFavorite(
        combo,
        userId,
        resolved.key,
        source
      )
      return NextResponse.json(
        { status: 'success', data: favorite },
        { status: 201 }
      )
    } catch (error) {
      // Concurrent requests can both miss the lookup above. The composite
      // unique key lets one insert win; return that row to both callers.
      const matching = await listComboFavorites(combo, userId, {
        key: resolved.key,
      })
      if (matching.length) {
        return NextResponse.json({ status: 'success', data: matching[0] })
      }
      throw error
    }
  } catch (error) {
    logger.error({ err: error }, 'Failed to add combo favorite')
    return fail(502, 'Unable to add favorite')
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const combo = getCombo((await params).combo)
  if (!combo) return fail(400, 'Invalid favorite combination')
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return fail(403, 'Invalid origin')
  }

  try {
    const { userId } = await authenticatedUserId(request)
    if (!userId) return fail(401, 'Unauthorized')

    const input = readSearchParams(combo, request)
    if (Object.keys(input).length !== keyParams(combo).length) {
      return fail(400, `Missing ${keyParams(combo).join(', ')}`)
    }
    const resolved = await resolveComboKey(combo, input)
    if ('error' in resolved) return fail(400, resolved.error)

    // Scope the lookup to the authenticated member so one member can never
    // delete another member's record.
    const matching = await listComboFavorites(combo, userId, {
      key: resolved.key,
    })
    if (!matching.length) return fail(404, 'Favorite not found')

    await deleteComboFavorite(combo, matching[0].id)
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    logger.error({ err: error }, 'Failed to remove combo favorite')
    return fail(502, 'Unable to remove favorite')
  }
}
