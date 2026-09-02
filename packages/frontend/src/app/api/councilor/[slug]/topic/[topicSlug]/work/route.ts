import { NextRequest, NextResponse } from 'next/server'
import fetchCouncilWork from '@/app/api/councilor/[slug]/topic/[topicSlug]/work/query'
import logger from '@/utils/logger'
import { getNumberParams } from '@/app/api/_core/utils'
import responseHelper, {
  getCachedSuccessStatus,
} from '@/app/api/_core/response-helper'
import { HttpStatus } from '@/app/api/_core/constants'

const getSearchParams = (searchParams: URLSearchParams) => ({
  councilMeetingId: getNumberParams(searchParams, 'mid', true),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; topicSlug: string }> }
) {
  const { slug, topicSlug } = await params
  if (!slug || !topicSlug) {
    return NextResponse.json(
      responseHelper.error(
        new Error('invalid parameters, slugs should not be empty')
      ),
      { status: HttpStatus.BAD_REQUEST }
    )
  }

  let parsedParams: ReturnType<typeof getSearchParams>
  try {
    parsedParams = getSearchParams(req.nextUrl.searchParams)
  } catch (err) {
    return NextResponse.json(responseHelper.error(err as Error), {
      status: HttpStatus.BAD_REQUEST,
    })
  }

  try {
    const work = await fetchCouncilWork({
      councilorSlug: slug,
      topicSlug,
      councilMeetingId: parsedParams.councilMeetingId,
    })
    return NextResponse.json(
      responseHelper.success(work),
      getCachedSuccessStatus()
    )
  } catch (err) {
    logger.error(
      { errMsg: err },
      `failed to fetch work of councilor ${slug} in topic ${topicSlug}`
    )
    return NextResponse.json(responseHelper.error(err as Error), {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
