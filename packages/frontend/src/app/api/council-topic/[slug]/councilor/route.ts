import { NextRequest, NextResponse } from 'next/server'
// fetcher
import fetchTopNCouncilorOfATopic from '@/app/api/council-topic/[slug]/councilor/query'
// util
import logger from '@/utils/logger'
import { getNumberParams } from '@/app/api/_core/utils'
import responseHelper, {
  getCachedSuccessStatus,
} from '@/app/api/_core/response-helper'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

type Params = {
  city: string
  excludeCouncilorSlug: string
  top?: number
}

const getSearchParams = (searchParams: URLSearchParams): Params => {
  const res: Partial<Params> = {}
  const city = searchParams.get('city')
  const excludeCouncilorSlug = searchParams.get('exclude')
  if (!city || !excludeCouncilorSlug) {
    throw new Error(`invalid parameter, city & exclude is required.`)
  }
  res.city = city
  res.excludeCouncilorSlug = excludeCouncilorSlug

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
    const { city, excludeCouncilorSlug, top } = parsedParams
    const councilors = await fetchTopNCouncilorOfATopic({
      topicSlug: slug,
      city,
      excludeCouncilorSlug,
      top,
    })
    return NextResponse.json(
      responseHelper.success(councilors),
      getCachedSuccessStatus()
    )
  } catch (err) {
    logger.error({ errMsg: err }, 'failed to fetch councilor of a topic')
    return NextResponse.json(responseHelper.error(err as Error), {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
