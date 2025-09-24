import { NextRequest, NextResponse } from 'next/server'
// fetcher
import fetchLegislatorMeetings from '@/app/api/legislator/[slug]/meeting/query'
// util
import logger from '@/utils/logger'
import responseHelper, {
  getCachedSuccessStatus,
} from '@/app/api/_core/response-helper'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  if (!slug) {
    return NextResponse.json(
      responseHelper.error(
        new Error('invalid parameters, slug should not be empty')
      ),
      {
        status: HttpStatus.BAD_REQUEST,
      }
    )
  }

  try {
    const meetings = await fetchLegislatorMeetings({ slug })
    return NextResponse.json(
      responseHelper.success(meetings),
      getCachedSuccessStatus()
    )
  } catch (err) {
    logger.error(
      { errMsg: err },
      `failed to fetch meetings of legislator ${slug}`
    )
    return NextResponse.json(responseHelper.error(err as Error), {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
