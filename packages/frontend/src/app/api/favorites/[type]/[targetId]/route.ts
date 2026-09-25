import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'
import {
  authenticatedUserId,
  deleteFavorite,
  getFavoriteType,
  listFavorites,
  validId,
} from '../../_lib'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; targetId: string }> }
) {
  const { type, targetId } = await params
  const favoriteType = getFavoriteType(type)
  if (!favoriteType || !validId(targetId)) {
    return NextResponse.json(
      { status: 'error', message: 'Invalid favorite type or targetId' },
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

    // Look the favorite up by the authenticated member so one member can never
    // delete another member's record.
    const matching = await listFavorites(favoriteType, userId, { targetId })
    if (!matching.length) {
      return NextResponse.json(
        { status: 'error', message: 'Favorite not found' },
        { status: 404 }
      )
    }

    await deleteFavorite(favoriteType, matching[0].id)
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    logger.error({ err: error }, 'Failed to remove favorite')
    return NextResponse.json(
      { status: 'error', message: 'Unable to remove favorite' },
      { status: 502 }
    )
  }
}
