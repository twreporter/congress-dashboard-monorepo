import { NextRequest, NextResponse } from 'next/server'
// fetcher
import fetchCouncilors from '@/app/api/councilor/query'
// util
import logger from '@/utils/logger'
import {
  getNumberParams,
  getNumberArrayParams,
  getStringArrayParams,
} from '@/app/api/_core/utils'
import responseHelper, {
  getCachedSuccessStatus,
} from '@/app/api/_core/response-helper'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

type Params = {
  councilMeeting: number
  partys?: number[]
  constituencies?: number[]
  types?: string[]
}

const getSearchParams = (searchParams: URLSearchParams): Params => {
  const res: Partial<Params> = {}

  const meetingId = getNumberParams(searchParams, 'mid', true)
  res.councilMeeting = meetingId

  const partys = getNumberArrayParams(searchParams, 'pids', false)
  if (partys.length > 0) {
    res.partys = partys
  }

  const constituencies = getNumberArrayParams(searchParams, 'cvs', false)
  if (constituencies.length > 0) {
    res.constituencies = constituencies
  }

  const types = getStringArrayParams(searchParams, 'types', false)
  if (types.length > 0) {
    res.types = types
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
    const { councilMeeting, partys, constituencies, types } = parsedParams
    const councilors = await fetchCouncilors({
      councilMeetingId: councilMeeting,
      partyIds: partys,
      constituencies,
      types,
    })
    return NextResponse.json(
      responseHelper.success(councilors),
      getCachedSuccessStatus()
    )
  } catch (err) {
    logger.error({ errMsg: err }, `failed to fetch councilors`)
    return NextResponse.json(responseHelper.error(err as Error), {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
