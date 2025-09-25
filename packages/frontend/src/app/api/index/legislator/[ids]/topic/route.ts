import { NextRequest, NextResponse } from 'next/server'
// fetcher
import fetchTopNTopics from '@/app/api/index/legislator/[ids]/topic/query'
// util
import logger from '@/utils/logger'
import { getNumberParams, getNumberArrayParams } from '@/app/api/_core/utils'
import responseHelper, {
  getCachedSuccessStatus,
} from '@/app/api/_core/response-helper'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

type Params = {
  legislativeMeeting: number
  legislativeMeetingSessions?: number[]
  top?: number
}

const getSearchParams = (searchParams: URLSearchParams): Params => {
  const res: Partial<Params> = {}

  const meetingId = getNumberParams(searchParams, 'mid', true)
  res.legislativeMeeting = meetingId

  const sessionIds = getNumberArrayParams(searchParams, 'sids', false)
  if (sessionIds.length > 0) {
    res.legislativeMeetingSessions = sessionIds
  }

  const top = getNumberParams(searchParams, 'top', false)
  if (top) {
    res.top = top
  }

  return res as Params
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ids: string }> }
) {
  const { ids } = await params
  if (!ids) {
    return NextResponse.json(
      responseHelper.error(
        new Error('invalid parameters, ids should not be empty')
      ),
      {
        status: HttpStatus.BAD_REQUEST,
      }
    )
  }
  let legislatorIds: number[] = []
  try {
    legislatorIds = ids.split(',').map((idString) => {
      const id = Number(idString)
      if (isNaN(id)) {
        throw new Error('invalid parameters, ids should not be NaN')
      }
      return id
    })
  } catch (err) {
    return NextResponse.json(responseHelper.error(err as Error), {
      status: HttpStatus.BAD_REQUEST,
    })
  }

  let parsedParams: Params
  try {
    const searchParams = req.nextUrl.searchParams
    parsedParams = getSearchParams(searchParams)
  } catch (err) {
    return NextResponse.json(responseHelper.error(err as Error), {
      status: HttpStatus.BAD_REQUEST,
    })
  }

  try {
    const { legislativeMeeting, legislativeMeetingSessions, top } = parsedParams
    const topics = await fetchTopNTopics({
      legislatorIds: legislatorIds,
      legislativeMeetingId: legislativeMeeting,
      legislativeMeetingSessionIds: legislativeMeetingSessions,
      take: top,
    })
    return NextResponse.json(
      responseHelper.success(topics),
      getCachedSuccessStatus()
    )
  } catch (err) {
    logger.error(
      { errMsg: err },
      `failed to fetch top n topics of legislators ${ids}`
    )
    return NextResponse.json(responseHelper.error(err as Error), {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
