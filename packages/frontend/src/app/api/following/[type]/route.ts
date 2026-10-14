import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'
import {
  authenticatedUserId,
  createFollowing,
  getFollowingType,
  hasSessions,
  listFollowing,
  meetingOfLegislativeYuanMember,
  parseSessionTerms,
  resolveSessionScope,
  updateFollowingScope,
  validId,
  type SessionScope,
} from '../_lib'

type Context = { params: Promise<{ type: string }> }

const errorResponse = (status: number, message: string) =>
  NextResponse.json({ status: 'error', message }, { status })

export async function GET(request: NextRequest, { params }: Context) {
  const followingType = getFollowingType((await params).type)
  if (!followingType) return errorResponse(400, 'Invalid following type')

  try {
    const { userId } = await authenticatedUserId(request)
    if (!userId) return errorResponse(401, 'Unauthorized')

    const take = request.nextUrl.searchParams.get('take') ?? '50'
    const skip = request.nextUrl.searchParams.get('skip') ?? '0'
    if (
      !/^\d+$/.test(take) ||
      !/^\d+$/.test(skip) ||
      Number(take) < 1 ||
      Number(take) > 100 ||
      !Number.isSafeInteger(Number(skip))
    ) {
      return errorResponse(400, 'Invalid pagination')
    }

    const following = await listFollowing(followingType, userId, {
      take: Number(take),
      skip: Number(skip),
    })
    return NextResponse.json(
      { status: 'success', data: following },
      {
        headers: { 'Cache-Control': 'private, no-store' },
      }
    )
  } catch (error) {
    logger.error({ err: error }, 'Failed to list following')
    return errorResponse(502, 'Unable to load following')
  }
}

export async function POST(request: NextRequest, { params }: Context) {
  const followingType = getFollowingType((await params).type)
  if (!followingType) return errorResponse(400, 'Invalid following type')
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return errorResponse(403, 'Invalid origin')
  }

  try {
    const { userId } = await authenticatedUserId(request)
    if (!userId) return errorResponse(401, 'Unauthorized')

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return errorResponse(400, 'Invalid JSON body')
    }
    if (body === null || typeof body !== 'object') {
      return errorResponse(400, 'Invalid JSON body')
    }
    const input = body as Record<string, unknown>
    const targetId = input.targetId
    if (!validId(targetId)) return errorResponse(400, 'Invalid targetId')

    let scope: SessionScope | undefined
    if (hasSessions(followingType)) {
      const parsed = parseSessionTerms(input.sessionTerms)
      if ('error' in parsed) return errorResponse(400, parsed.error)

      const meetingWhere = await meetingOfLegislativeYuanMember(targetId)
      if (!meetingWhere) return errorResponse(400, 'Unknown targetId')

      const resolved = await resolveSessionScope(meetingWhere, parsed.terms)
      if ('error' in resolved) return errorResponse(400, resolved.error)
      scope = resolved
    } else if (input.sessionTerms !== undefined) {
      return errorResponse(400, 'This following type has no sessions')
    }

    const existing = await listFollowing(followingType, userId, { targetId })
    if (existing.length) {
      // Following again only adjusts the session scope of the existing row.
      const updated =
        scope && hasSessions(followingType)
          ? await updateFollowingScope(followingType, existing[0].id, scope)
          : existing[0]
      return NextResponse.json({ status: 'success', data: updated })
    }

    try {
      const created = await createFollowing(
        followingType,
        userId,
        targetId,
        scope
      )
      return NextResponse.json(
        { status: 'success', data: created },
        { status: 201 }
      )
    } catch (error) {
      // Concurrent requests can both miss the lookup above. The database unique
      // key lets only one insert succeed; return that record to both callers.
      const matching = await listFollowing(followingType, userId, { targetId })
      if (matching.length) {
        return NextResponse.json({ status: 'success', data: matching[0] })
      }
      throw error
    }
  } catch (error) {
    logger.error({ err: error }, 'Failed to add following')
    return errorResponse(502, 'Unable to add following')
  }
}
