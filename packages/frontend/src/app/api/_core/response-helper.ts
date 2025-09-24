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

export default { success, error }
