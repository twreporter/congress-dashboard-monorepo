import { NextResponse } from 'next/server'
// fetcher
import fetchLegislativeMeetings from '@/app/api/legislative-meeting/query'
// util
import logger from '@/utils/logger'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

export async function GET() {
  try {
    const legislativeMeetings = await fetchLegislativeMeetings()
    return NextResponse.json(
      {
        data: legislativeMeetings,
      },
      {
        status: HttpStatus.OK,
      }
    )
  } catch (err) {
    logger.error({ errMsg: err }, 'failed to fetch legislativeMeetings')
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
