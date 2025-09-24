import { NextRequest, NextResponse } from 'next/server'
// fetcher
import fetchLegislators from '@/app/api/legislator/query'
// util
import logger from '@/utils/logger'
import {
  getNumberParams,
  getNumberArrayParams,
  getStringArrayParams,
} from '@/app/api/_core/utils'
import responseHelper from '@/app/api/_core/response-helper'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

type Params = {
  legislativeMeeting: number
  legislativeMeetingSessions?: number[]
  partys?: number[]
  constituencies?: string[]
  committeeSlugs?: string[]
}

const getSearchParams = (searchParams: URLSearchParams): Params => {
  const res: Partial<Params> = {}

  const meetingId = getNumberParams(searchParams, 'mid', true)
  res.legislativeMeeting = meetingId

  const sessionIds = getNumberArrayParams(searchParams, 'sids', false)
  if (sessionIds.length > 0) {
    res.legislativeMeetingSessions = sessionIds
  }

  const partys = getNumberArrayParams(searchParams, 'pids', false)
  if (partys.length > 0) {
    res.partys = partys
  }

  const constituencies = getStringArrayParams(searchParams, 'cvs', false)
  if (constituencies.length > 0) {
    res.constituencies = constituencies
  }

  const committeeSlugs = getStringArrayParams(searchParams, 'css', false)
  if (committeeSlugs.length > 0) {
    res.committeeSlugs = committeeSlugs
  }

  return res as Params
}

export async function GET(req: NextRequest) {
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
    const {
      legislativeMeeting,
      legislativeMeetingSessions,
      partys,
      constituencies,
      committeeSlugs,
    } = parsedParams
    const legislators = await fetchLegislators({
      legislativeMeetingId: legislativeMeeting,
      legislativeMeetingSessionIds: legislativeMeetingSessions,
      partyIds: partys,
      constituencies,
      committeeSlugs,
    })
    return NextResponse.json(responseHelper.success(legislators), {
      status: HttpStatus.OK,
    })
  } catch (err) {
    logger.error({ errMsg: err }, `failed to fetch legislators`)
    return NextResponse.json(responseHelper.error(err as Error), {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
