import { NextResponse } from 'next/server'
// fetcher
import fetchCommittee from '@/app/api/committee/query'
// util
import logger from '@/utils/logger'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

export async function GET() {
  try {
    const committees = await fetchCommittee()
    return NextResponse.json(
      {
        data: committees,
      },
      {
        status: HttpStatus.OK,
      }
    )
  } catch (err) {
    logger.error({ errMsg: err }, 'failed to fetch committees')
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
