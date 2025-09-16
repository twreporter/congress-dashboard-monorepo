import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidV4 } from 'uuid'
// util
import logger from '@/utils/logger'
import { isFeedback } from '@/app/api/feedback/utils'
import slack from '@/app/api/feedback/slack'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

export async function POST(req: NextRequest) {
  const requestId = uuidV4()
  let body
  try {
    body = await req.json()
  } catch (error) {
    let errMsg = ''
    if (error instanceof Error) {
      errMsg = error.message
    }
    logger.error({ requestId, errMsg }, 'slack api error')
    return NextResponse.json(
      { error: 'Invalid JSON in request body: cannot get body object.' },
      { status: HttpStatus.BAD_REQUEST }
    )
  }

  logger.info({ requestId, request: body }, 'incoming API request: feedback')

  if (!isFeedback(body)) {
    logger.error(
      { requestId, errMsg: 'invalid feedback data' },
      'slack api error'
    )
    return NextResponse.json(
      { error: 'Invalid JSON in request body: not valid feedback.' },
      { status: HttpStatus.BAD_REQUEST }
    )
  }

  try {
    const slackRes = await slack(body)
    if (slackRes.ok) {
      logger.debug(
        { requestId, response: { success: true } },
        'slack api response'
      )
      return NextResponse.json({ success: true })
    }

    logger.error({ requestId, errMsg: slackRes.error }, 'slack api error')
    return NextResponse.json(
      { error: slackRes.error || 'failed to call slack webhook' },
      { status: slackRes.status }
    )
  } catch (error) {
    let errMsg = ''
    if (error instanceof Error) {
      errMsg = error.message
    }
    logger.error({ requestId, errMsg }, 'slack api error')
    return NextResponse.json(
      { error: errMsg },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    )
  }
}
