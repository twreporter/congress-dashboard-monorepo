import { NextRequest, NextResponse } from 'next/server'
// fetcher
import fetchBillsOfACouncilorInATopic from '@/app/api/councilor/[slug]/topic/[topicSlug]/bill/query'
// util
import logger from '@/utils/logger'
import { getNumberParams } from '@/app/api/_core/utils'
import responseHelper, {
  getCachedSuccessStatus,
} from '@/app/api/_core/response-helper'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

type Params = {
  councilMeetingId: number
}

const getSearchParams = (searchParams: URLSearchParams): Params => {
  const res: Partial<Params> = {}

  const meetingId = getNumberParams(searchParams, 'mid', true)
  res.councilMeetingId = meetingId

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
    const { councilMeetingId } = parsedParams
    const bills = await fetchBillsOfACouncilorInATopic({
      councilorSlug: slug,
      topicSlug,
      councilMeetingId,
    })
    return NextResponse.json(
      responseHelper.success(bills),
      getCachedSuccessStatus()
    )
  } catch (err) {
    logger.error(
      { errMsg: err },
      `failed to fetch bills of councilor ${slug} in topic ${topicSlug}`
    )
    return NextResponse.json(responseHelper.error(err as Error), {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
