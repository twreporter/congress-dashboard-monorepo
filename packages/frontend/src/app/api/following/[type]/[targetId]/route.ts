import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'
import {
  authenticatedUserId,
  deleteFollowing,
  getFollowingType,
  listFollowing,
  validId,
} from '../../_lib'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; targetId: string }> }
) {
  const { type, targetId } = await params
  const followingType = getFollowingType(type)
  if (!followingType || !validId(targetId)) {
    return NextResponse.json(
      { status: 'error', message: 'Invalid following type or targetId' },
      { status: 400 }
    )
  }
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return NextResponse.json(
      { status: 'error', message: 'Invalid origin' },
      { status: 403 }
    )
  }

  try {
    const { userId } = await authenticatedUserId(request)
    if (!userId) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Look the record up by the authenticated member so one member can never
    // delete another member's record.
    const matching = await listFollowing(followingType, userId, { targetId })
    if (!matching.length) {
      return NextResponse.json(
        { status: 'error', message: 'Following not found' },
        { status: 404 }
      )
    }

    await deleteFollowing(followingType, matching[0].id)
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    logger.error({ err: error }, 'Failed to remove following')
    return NextResponse.json(
      { status: 'error', message: 'Unable to remove following' },
      { status: 502 }
    )
  }
}
