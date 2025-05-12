import {
  FeedbackType,
  ProductProblemType,
  DeviceType,
  OSType,
  BrowserType,
} from '@/components/feedback/enum'

export type FeedbackValue = ContentDetail & {
  fromUrl: string
  type?: FeedbackType
  problemType?: ProductProblemType
  deviceType?: DeviceType
  osType?: OSType
  browserType?: BrowserType
}

export type ContentDetail = {
  username?: string
  email?: string
  problem: string
}

export type ProductDetail = {
  username?: string
  email?: string
  problemType: ProductProblemType
  deviceType: DeviceType
  osType: OSType
  browserType: BrowserType
  problem: string
}
