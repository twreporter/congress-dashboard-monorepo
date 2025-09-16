import { NextRequest, NextResponse } from 'next/server'
// fetcher
import fetchTopNTopics from '@/app/api/topic/query'
// util
import logger from '@/utils/logger'
import { getNumberParams, getNumberArrayParams } from '../_core/utils'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

type Params = {
  legislativeMeeting: number
  legislativeMeetingSessions?: number[]
  partys?: number[]
  take?: number
  skip?: number
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
    return NextResponse.json(
      {
        error: err,
      },
      {
        status: HttpStatus.BAD_REQUEST,
      }
    )
  }

  try {
    const {
      legislativeMeeting,
      legislativeMeetingSessions,
      partys,
      take,
      skip,
    } = parsedParams
    const topics = await fetchTopNTopics({
      legislativeMeetingId: legislativeMeeting,
      legislativeMeetingSessionIds: legislativeMeetingSessions,
      partyIds: partys,
      take,
      skip,
    })
    return NextResponse.json(
      {
        data: topics,
      },
      {
        status: HttpStatus.OK,
      }
    )
  } catch (err) {
    logger.error({ errMsg: err }, `failed to fetch top N topics`)
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
