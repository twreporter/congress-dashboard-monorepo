// type
import type { Feedback } from '@/app/api/feedback/type'
// enum
import {
  FeedbackType,
  ProductProblemType,
  DeviceType,
  OSType,
  BrowserType,
} from '@/components/feedback/enum'

const getTypeText = (problemType: ProductProblemType): string => {
  switch (problemType) {
    case ProductProblemType.Advice:
      return '產品改進建議'
    case ProductProblemType.Feature:
      return '功能異常'
    case ProductProblemType.UX:
      return '使用體驗問題'
    case ProductProblemType.UI:
      return '介面顯示問題'
    default:
      return ''
  }
}

const getDeviceText = (deviceType: DeviceType): string => {
  switch (deviceType) {
    case DeviceType.Desktop:
      return '桌機/筆電'
    case DeviceType.Mobile:
      return '手機'
    case DeviceType.Tablet:
      return '平板'
    default:
      return ''
  }
}

const getOSText = (osType: OSType | string): string => {
  switch (osType) {
    case OSType.Android:
      return 'Android'
    case OSType.Ios:
      return 'iOS'
    case OSType.Mac:
      return 'MacOS'
    case OSType.Windows:
      return 'Windows'
    case OSType.Linux:
      return 'Linux'
    case OSType.Other:
    default:
      return `其他（${osType}）`
  }
}

const getBrowserText = (browserType: BrowserType | string): string => {
  switch (browserType) {
    case BrowserType.Chrome:
      return 'Chrome'
    case BrowserType.Safari:
      return 'Safari'
    case BrowserType.Edge:
      return 'Edge'
    case BrowserType.Firefox:
      return 'Firefox'
    case BrowserType.Opera:
      return 'Opera'
    case BrowserType.Other:
    default:
      return `其他（${browserType}）`
  }
}

function getMultiSelectText<T>(
  values: T[],
  formatter: (values: T) => string
): string {
  let result = ''
  values.forEach((value) => {
    if (result) {
      result += '、'
    }
    result += formatter(value)
  })

  return result
}

type generatePayloadFromFeedbackType = (feedback: Feedback) => string

export const generatePayloadFromFeedback: generatePayloadFromFeedbackType = (
  feedback
) => {
  if (feedback.type === FeedbackType.Content) {
    const emailText = feedback.email ? `（${feedback.email}）` : ''
    const problemText = feedback.problem ? `「${feedback.problem}」` : ''
    return `:pencil2:${feedback.username}${emailText} 回報${problemText}來自 ${feedback.fromUrl}`
  }

  // product feedback
  const emailText = feedback.email ? `（${feedback.email}）` : ''
  const problemText = feedback.problem ? `「${feedback.problem}」` : ''
  return `:hammer_and_wrench:${
    feedback.username
  }${emailText} 回報【${getTypeText(
    feedback.problemType
  )}】${problemText}來自 ${feedback.fromUrl}
    ＊裝置類型：${getMultiSelectText(feedback.deviceType, getDeviceText)}
    ＊作業系統：${getMultiSelectText(feedback.osType, getOSText)}
    ＊瀏覽器：${getMultiSelectText(feedback.browserType, getBrowserText)}
  `
}

export const isFeedback = (obj: unknown): obj is Feedback => {
  if (typeof obj !== 'object' || obj === null) return false

  if (!('fromUrl' in obj) || typeof obj.fromUrl !== 'string') {
    return false
  }

  if (!('userAgent' in obj) || typeof obj.userAgent !== 'string') {
    return false
  }

  if (!('type' in obj)) {
    return false
  }

  const isContent = obj.type === FeedbackType.Content
  const isProduct =
    obj.type === FeedbackType.Product &&
    'browserType' in obj &&
    'osType' in obj &&
    'deviceType' in obj

  return isContent || isProduct
}
