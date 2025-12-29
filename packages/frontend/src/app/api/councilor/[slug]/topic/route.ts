import { NextRequest, NextResponse } from 'next/server'
// fetcher
import fetchTopicsOfACouncilor from '@/app/api/councilor/[slug]/topic/query'
// util
import logger from '@/utils/logger'
import responseHelper, {
  getCachedSuccessStatus,
} from '@/app/api/_core/response-helper'
import { getNumberParams } from '@/app/api/_core/utils'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

type Params = {
  city: string
  excludeTopicSlug?: string
  top?: number
}

const getSearchParams = (searchParams: URLSearchParams): Params => {
  const res: Partial<Params> = {}
  const city = searchParams.get('city')
  if (!city) {
    throw new Error(`invalid parameter, city is required.`)
  }
  res.city = city

  const excludeTopicSlug = searchParams.get('exclude')
  if (excludeTopicSlug) {
    res.excludeTopicSlug = excludeTopicSlug
  }

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
    return NextResponse.json(
      responseHelper.error(
        new Error('invalid parameters, slug should not be empty')
      ),
      {
        status: HttpStatus.BAD_REQUEST,
      }
    )
  }

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
    const { city, excludeTopicSlug, top } = parsedParams
    const topics = await fetchTopicsOfACouncilor({
      councilorSlug: slug,
      city,
      excludeTopicSlug,
      top,
    })
    return NextResponse.json(
      responseHelper.success(topics),
      getCachedSuccessStatus()
    )
  } catch (err) {
    logger.error({ errMsg: err }, 'failed to fetch topics of a councilor')
    return NextResponse.json(responseHelper.error(err as Error), {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
