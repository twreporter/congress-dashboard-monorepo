import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'
import {
  authenticatedUserId,
  comboKeyParams,
  createComboFollowing,
  defaultSource,
  deleteComboFollowing,
  getCombo,
  listComboFollowing,
  resolveComboCreateKey,
  resolveComboLookupKey,
  updateComboScope,
  validSource,
  type Combo,
} from '../../_combo'
import {
  parsePagination,
  parseSessionTerms,
  resolveSessionScope,
  type SessionScope,
} from '../../_lib'

type Context = { params: Promise<{ combo: string }> }

const fail = (status: number, message: string) =>
  NextResponse.json({ status: 'error', message }, { status })

const readSearchParams = (combo: Combo, request: NextRequest) => {
  const { required, optional } = comboKeyParams(combo)
  const input: Record<string, unknown> = {}
  for (const name of [...required, ...optional]) {
    const value = request.nextUrl.searchParams.get(name)
    if (value !== null) input[name] = value
  }
  return input
}

const hasKeyParams = (combo: Combo, input: Record<string, unknown>) =>
  comboKeyParams(combo).required.every((name) => name in input)

export async function GET(request: NextRequest, { params }: Context) {
  const combo = getCombo((await params).combo)
  if (!combo) return fail(400, 'Invalid following combination')

  try {
    const { userId } = await authenticatedUserId(request)
    if (!userId) return fail(401, 'Unauthorized')

    const pagination = parsePagination(request.nextUrl.searchParams)
    if ('error' in pagination) return fail(400, pagination.error)

    // Supplying the full key turns this into an "is it followed?" lookup.
    const input = readSearchParams(combo, request)
    let key
    if (hasKeyParams(combo, input)) {
      const resolved = resolveComboLookupKey(combo, input)
      if ('error' in resolved) return fail(400, resolved.error)
      key = resolved
    }

    const following = await listComboFollowing(combo, userId, {
      key,
      ...pagination,
    })
    return NextResponse.json(
      { status: 'success', data: following },
      { headers: { 'Cache-Control': 'private, no-store' } }
    )
  } catch (error) {
    logger.error({ err: error }, 'Failed to list combo following')
    return fail(502, 'Unable to load following')
  }
}

export async function POST(request: NextRequest, { params }: Context) {
  const combo = getCombo((await params).combo)
  if (!combo) return fail(400, 'Invalid following combination')
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

    const resolved = await resolveComboCreateKey(combo, input)
    if ('error' in resolved) return fail(400, resolved.error)

    if (!(await resolved.validate())) {
      return fail(422, 'The pair has no record in this term')
    }

    let scope: SessionScope | undefined
    if (resolved.meetingWhere) {
      const parsed = parseSessionTerms(input.sessionTerms)
      if ('error' in parsed) return fail(400, parsed.error)

      const sessions = await resolveSessionScope(
        resolved.meetingWhere,
        parsed.terms
      )
      if ('error' in sessions) return fail(400, sessions.error)
      scope = sessions
    } else if (input.sessionTerms !== undefined) {
      return fail(400, 'This combination has no sessions')
    }
    const existing = await listComboFollowing(combo, userId, {
      key: resolved.key,
    })
    if (existing.length) {
      // Following again only adjusts the session scope of the existing row.
      const updated = scope
        ? await updateComboScope(combo, existing[0].id, scope)
        : existing[0]
      return NextResponse.json({ status: 'success', data: updated })
    }

    const source = defaultSource(combo, input.source)
    try {
      const created = await createComboFollowing(
        combo,
        userId,
        resolved.key,
        source,
        scope
      )
      return NextResponse.json(
        { status: 'success', data: created },
        { status: 201 }
      )
    } catch (error) {
      // Concurrent requests can both miss the lookup above. The composite
      // unique key lets one insert win; return that row to both callers.
      const matching = await listComboFollowing(combo, userId, {
        key: resolved.key,
      })
      if (matching.length) {
        return NextResponse.json({ status: 'success', data: matching[0] })
      }
      throw error
    }
  } catch (error) {
    logger.error({ err: error }, 'Failed to add combo following')
    return fail(502, 'Unable to add following')
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const combo = getCombo((await params).combo)
  if (!combo) return fail(400, 'Invalid following combination')
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return fail(403, 'Invalid origin')
  }

  try {
    const { userId } = await authenticatedUserId(request)
    if (!userId) return fail(401, 'Unauthorized')

    const input = readSearchParams(combo, request)
    if (!hasKeyParams(combo, input)) {
      return fail(400, `Missing ${comboKeyParams(combo).required.join(', ')}`)
    }
    const resolved = resolveComboLookupKey(combo, input)
    if ('error' in resolved) return fail(400, resolved.error)

    // Scope the lookup to the authenticated member so one member can never
    // delete another member's record.
    const matching = await listComboFollowing(combo, userId, { key: resolved })
    if (!matching.length) return fail(404, 'Following not found')

    await deleteComboFollowing(combo, matching[0].id)
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    logger.error({ err: error }, 'Failed to remove combo following')
    return fail(502, 'Unable to remove following')
  }
}
