import { NextRequest, NextResponse } from 'next/server'
// fetcher
import fetchLegislatorMeetings from '@/app/api/legislator/[slug]/meeting/query'
// util
import logger from '@/utils/logger'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  if (!slug) {
    return NextResponse.json(
      {
        error: `invalid parameters, slug should not be empty`,
      },
      {
        status: HttpStatus.BAD_REQUEST,
      }
    )
  }

  try {
    const mettings = await fetchLegislatorMeetings({ slug })
    return NextResponse.json(
      {
        data: mettings,
      },
      {
        status: HttpStatus.OK,
      }
    )
  } catch (err) {
    logger.error(
      { errMsg: err },
      `failed to fetch meetings of legislator ${slug}`
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
