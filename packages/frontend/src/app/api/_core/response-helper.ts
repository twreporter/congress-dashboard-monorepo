import { HttpStatus } from '@/app/api/_core/constants'

// global var
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const isDebug = releaseBranch === 'master'

type SuccessResponse = {
  data: object | object[]
  status: 'success'
}

function success(data: object | object[]): SuccessResponse {
  return {
    data,
    status: 'success',
  }
}

type ErrorResponse = {
  message: string
  name?: string
  stack?: string | undefined
  status: 'error'
}

function error(err: Error): ErrorResponse {
  const res: ErrorResponse = { message: err.message, status: 'error' }
  if (isDebug) {
    res.name = err.name
    res.stack = err.stack
  }
  return res
}

const twoHours = 7200
type CacheHeader = {
  status: typeof HttpStatus.OK
  headers?: {
    'Cache-Control': string
  }
}
export function getCachedSuccessStatus(): CacheHeader {
  const res: CacheHeader = { status: HttpStatus.OK }
  if (!isDebug) {
    res.headers = {
      'Cache-Control': `public, max-age=${twoHours}, s-maxage=${twoHours}`,
    }
  }
  return res
}

export default { success, error }
