import { NextRequest, NextResponse } from 'next/server'
import keystoneFetch, { GraphQLResponse } from '@/app/api/graphql/keystone'

export async function POST<T>(req: NextRequest) {
  const body = await req.json()

  try {
    const response: GraphQLResponse<T> = await keystoneFetch<T>(
      body.query,
      body.variables
    )
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
