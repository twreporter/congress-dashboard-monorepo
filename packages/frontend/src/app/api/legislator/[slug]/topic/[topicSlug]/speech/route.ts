import { NextRequest, NextResponse } from 'next/server'
// fetcher
import fetchSpeechesOfALegislatorInATopic from '@/app/api/legislator/[slug]/topic/[topicSlug]/speech/query'
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
}

const getSearchParams = (searchParams: URLSearchParams): Params => {
  const res: Partial<Params> = {}

  const meetingId = getNumberParams(searchParams, 'mid', true)
  res.legislativeMeeting = meetingId

  const sessionIds = getNumberArrayParams(searchParams, 'sids', false)
  if (sessionIds.length > 0) {
    res.legislativeMeetingSessions = sessionIds
  }

  return res as Params
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; topicSlug: string }> }
) {
  const { slug, topicSlug } = await params
  if (!slug || !topicSlug) {
    return NextResponse.json(
      responseHelper.error(
        new Error('invalid parameters, slug should not be empty')
      ),
      {
        status: HttpStatus.BAD_REQUEST,
      }
    )
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
    const { legislativeMeeting, legislativeMeetingSessions } = parsedParams
    const speeches = await fetchSpeechesOfALegislatorInATopic({
      slug,
      topicSlug,
      legislativeMeetingId: legislativeMeeting,
      legislativeMeetingSessionIds: legislativeMeetingSessions,
    })
    return NextResponse.json(
      responseHelper.success(speeches),
      getCachedSuccessStatus()
    )
  } catch (err) {
    logger.error(
      { errMsg: err },
      `failed to fetch speeches of legislator ${slug} in topic ${topicSlug}`
    )
    return NextResponse.json(responseHelper.error(err as Error), {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
