import { NextRequest, NextResponse } from 'next/server'
// fetcher
import fetchLegislativeMeetingSessions from '@/app/api/legislative-meeting/[term]/session/query'
// util
import logger from '@/utils/logger'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ term: string }> }
) {
  try {
    const { term } = await params
    if (!term || isNaN(Number(term))) {
      return NextResponse.json(
        {
          error: `invalid parameters, term should not be empty or NaN`,
        },
        {
          status: HttpStatus.BAD_REQUEST,
        }
      )
    }

    const sessions = await fetchLegislativeMeetingSessions({
      legislativeMeetingTerm: term,
    })
    return NextResponse.json({
      data: sessions,
      status: HttpStatus.OK,
    })
  } catch (err) {
    logger.error({ errMsg: err }, 'failed to fetch meeting sessions')
    return NextResponse.json(
      {
        error: err,
      },
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }
    )
  }
}
