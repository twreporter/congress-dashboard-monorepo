import {
  FeedbackType,
  ProductProblemType,
  DeviceType,
  OSType,
  BrowserType,
} from '@/components/feedback/enum'

export type ContentDetail = {
  type: FeedbackType
  username?: string
  email?: string
  problem: string
}

export type ProductDetail = {
  type: FeedbackType
  username?: string
  email?: string
  problemType: ProductProblemType
  deviceType: DeviceType
  osType: OSType | string
  browserType: BrowserType | string
  problem: string
}
