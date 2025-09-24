import { NextRequest, NextResponse } from 'next/server'
// fetcher
import fetchTopicsOfALegislator from '@/app/api/legislator/[slug]/topic/query'
// util
import logger from '@/utils/logger'
import { getNumberParams, getNumberArrayParams } from '@/app/api/_core/utils'
// constant
import { HttpStatus } from '@/app/api/_core/constants'
// enum
import { FilterKey } from '@/app/api/legislator/[slug]/topic/enum'

type Params = {
  legislativeMeeting: number
  legislativeMeetingSessions?: number[]
  top?: number
  key: FilterKey
}

const getSearchParams = (searchParams: URLSearchParams): Params => {
  const res: Partial<Params> = {}
  const filterKey = searchParams.get('key')
  if (filterKey === FilterKey.ID) {
    const meetingId = getNumberParams(searchParams, 'mid', true)
    res.legislativeMeeting = meetingId

    const sessionIds = getNumberArrayParams(searchParams, 'sids', false)
    if (sessionIds.length > 0) {
      res.legislativeMeetingSessions = sessionIds
    }
  } else if (filterKey === FilterKey.TERM) {
    const meetingTerm = getNumberParams(searchParams, 'mt', true)
    res.legislativeMeeting = meetingTerm

    const sessionTerms = getNumberArrayParams(searchParams, 'sts', false)
    if (sessionTerms.length > 0) {
      res.legislativeMeetingSessions = sessionTerms
    }
  } else {
    throw new Error('invalid parameter, key should be id or term')
  }
  res.key = filterKey

  const top = getNumberParams(searchParams, 'top', false)
  if (top) {
    res.top = top
  }

  return res as Params
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  if (!slug) {
    return NextResponse.json({
      error: `invalid parameters, slug should not be empty`,
      status: HttpStatus.BAD_REQUEST,
    })
  }

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
    const { legislativeMeeting, legislativeMeetingSessions, top, key } =
      parsedParams
    const topics = await fetchTopicsOfALegislator({
      key,
      slug,
      legislativeMeeting,
      legislativeMeetingSessions,
      top,
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
    logger.error(
      { errMsg: err },
      `failed to fetch topics of legislator ${slug}`
    )
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
