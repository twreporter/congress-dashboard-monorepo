import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidV4 } from 'uuid'
import keystoneFetch, { GraphQLResponse } from '@/app/api/graphql/keystone'
import logger from '@/utils/logger'

export async function POST<T>(req: NextRequest) {
  const body = await req.json()
  const requestId = uuidV4()
  logger.info({ requestId, request: body }, 'incoming API request')

  try {
    const response: GraphQLResponse<T> = await keystoneFetch<T>(
      body.query,
      body.variables
    )
    logger.debug({ requestId, response }, 'keystone api response')
    return NextResponse.json(response)
  } catch (error) {
    let errMsg = ''
    if (error instanceof Error) {
      errMsg = error.message
    }
    logger.error({ requestId, errMsg }, 'keystone api error')
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}
