import { NextRequest, NextResponse } from 'next/server'
// fetcher
import fetchCommitteeMember from '@/app/api/committee-member/[slug]/query'
// util
import logger from '@/utils/logger'
import { getNumberParams } from '@/app/api/_core/utils'
import responseHelper, {
  getCachedSuccessStatus,
} from '@/app/api/_core/response-helper'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

type Params = {
  legislativeMeeting: number
}

const getSearchParams = (searchParams: URLSearchParams): Params => {
  const res: Partial<Params> = {}

  const meetingId = getNumberParams(searchParams, 'mid', true)
  res.legislativeMeeting = meetingId

  return res as Params
}

export async function GET(
  req: NextRequest,
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
    const { legislativeMeeting } = parsedParams
    const committeeMembers = await fetchCommitteeMember({
      slug,
      legislativeMeetingId: legislativeMeeting,
    })
    return NextResponse.json(
      responseHelper.success(committeeMembers),
      getCachedSuccessStatus()
    )
  } catch (err) {
    logger.error({ errMsg: err }, 'failed to fetch committeeMembers')
    return NextResponse.json(responseHelper.error(err as Error), {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
