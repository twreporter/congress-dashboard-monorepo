import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidV4 } from 'uuid'
// util
import logger from '@/utils/logger'
import { isFeedback } from '@/app/api/feedback/utils'
import slack from '@/app/api/feedback/slack'
import sendReplyEmail from '@/app/api/feedback/email'
import { isRateLimited } from '@/app/api/feedback/rate-limiter'
import { sanitizeUsername } from '@/app/api/feedback/sanitize'
import responseHelper from '@/app/api/_core/response-helper'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

export async function POST(req: NextRequest) {
  const requestId = uuidV4()

  // --- Rate limiting (by IP) ---
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  if (isRateLimited(ip)) {
    logger.warn({ requestId, ip }, 'rate limited feedback request')
    return NextResponse.json(
      responseHelper.error(
        new Error('Too many requests. Please try again later.')
      ),
      { status: HttpStatus.TOO_MANY_REQUESTS }
    )
  }

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
      responseHelper.error(
        new Error('Invalid JSON in request body: cannot get body object.')
      ),
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
      responseHelper.error(
        new Error('Invalid JSON in request body: not valid feedback.')
      ),
      { status: HttpStatus.BAD_REQUEST }
    )
  }

  // --- Sanitize username before downstream use ---
  body.username = sanitizeUsername(body.username)

  try {
    const slackRes = await slack(body)
    if (slackRes.ok) {
      logger.debug(
        { requestId, response: { status: 'success' } },
        'slack api response'
      )

      // Send reply email if user provided an email address
      if (body.email) {
        const emailRes = await sendReplyEmail(body)
        if (!emailRes.ok) {
          logger.error(
            { requestId, errMsg: emailRes.error?.message },
            'reply email error'
          )
        } else {
          logger.debug({ requestId }, 'reply email sent')
        }
      }

      return NextResponse.json(responseHelper.success({ success: true }))
    }

    logger.error({ requestId, errMsg: slackRes.error }, 'slack api error')
    return NextResponse.json(
      responseHelper.error(
        slackRes.error || new Error('failed to call slack webhook')
      ),
      { status: slackRes.status }
    )
  } catch (error) {
    let errMsg = ''
    if (error instanceof Error) {
      errMsg = error.message
    }
    logger.error({ requestId, errMsg }, 'slack api error')
    return NextResponse.json(responseHelper.error(error as Error), {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
