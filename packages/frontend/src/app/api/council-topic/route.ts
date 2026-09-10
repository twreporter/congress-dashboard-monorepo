import { NextRequest, NextResponse } from 'next/server'
// fetcher
import fetchTopNCouncilTopics from '@/app/api/council-topic/query'
// util
import logger from '@/utils/logger'
import { getNumberParams, getNumberArrayParams } from '@/app/api/_core/utils'
import responseHelper, {
  getCachedSuccessStatus,
} from '@/app/api/_core/response-helper'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

type Params = {
  councilMeetingId: number
  partyIds?: number[]
  take?: number
  skip?: number
}

const getSearchParams = (searchParams: URLSearchParams): Params => {
  const res: Partial<Params> = {}

  const meetingId = getNumberParams(searchParams, 'mid', true)
  res.councilMeetingId = meetingId

  const partyIds = getNumberArrayParams(searchParams, 'pids', false)
  if (partyIds.length > 0) {
    res.partyIds = partyIds
  }

  const take = getNumberParams(searchParams, 'take', false)
  if (take) {
    res.take = take
  }

  const skip = getNumberParams(searchParams, 'skip', false)
  if (skip) {
    res.skip = skip
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
    const { councilMeetingId, partyIds, take, skip } = parsedParams
    const topics = await fetchTopNCouncilTopics({
      councilMeetingId,
      partyIds,
      take,
      skip,
    })
    return NextResponse.json(
      responseHelper.success(topics),
      getCachedSuccessStatus()
    )
  } catch (err) {
    logger.error({ errMsg: err }, `failed to fetch council topics`)
    return NextResponse.json(responseHelper.error(err as Error), {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
