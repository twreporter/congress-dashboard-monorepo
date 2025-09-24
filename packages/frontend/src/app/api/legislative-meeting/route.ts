import { NextResponse } from 'next/server'
// fetcher
import fetchLegislativeMeetings from '@/app/api/legislative-meeting/query'
// util
import logger from '@/utils/logger'
import responseHelper, {
  getCachedSuccessStatus,
} from '@/app/api/_core/response-helper'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

export async function GET() {
  try {
    const legislativeMeetings = await fetchLegislativeMeetings()
    return NextResponse.json(
      responseHelper.success(legislativeMeetings),
      getCachedSuccessStatus()
    )
  } catch (err) {
    logger.error({ errMsg: err }, 'failed to fetch legislativeMeetings')
    return NextResponse.json(responseHelper.error(err as Error), {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
