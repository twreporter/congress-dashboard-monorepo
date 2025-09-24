type ParamKey = string

type GetNumberParamFunc = (
  searchParams: URLSearchParams,
  key: ParamKey,
  isRequired: boolean
) => number
export const getNumberParams: GetNumberParamFunc = (
  searchParams,
  key,
  isRequired
) => {
  const paramString = searchParams.get(key)
  if (isRequired && !paramString) {
    throw new Error(`invalid parameter, ${key} is required.`)
  }

  const param = Number(paramString)
  if (isNaN(param)) {
    throw new Error(`invalid parameter, ${key} should not be NaN`)
  }

  return param
}

type GetNumberArrayParams = (
  searchParams: URLSearchParams,
  key: ParamKey,
  isRequired: boolean
) => number[]
export const getNumberArrayParams: GetNumberArrayParams = (
  searchParams,
  key,
  isRequired
) => {
  const paramStrings = searchParams.get(key)
  if (!paramStrings) {
    if (isRequired) {
      throw new Error(`invalid parameter, ${key} is required.`)
    }
    return []
  }

  const paramNumberArray = paramStrings.split(',').map((param: string) => {
    if (isNaN(Number(param))) {
      throw new Error(`invalid parameter, ${key} should not be NaN`)
    }
    return Number(param)
  })
  return paramNumberArray
}

type GetStringArrayParams = (
  searchParams: URLSearchParams,
  key: ParamKey,
  isRequired: boolean
) => string[]
export const getStringArrayParams: GetStringArrayParams = (
  searchParams,
  key,
  isRequired
) => {
  const paramStrings = searchParams.get(key)
  if (!paramStrings) {
    if (isRequired) {
      throw new Error(`invalid parameter, ${key} is required.`)
    }
    return []
  }

  return paramStrings.split(',')
}
