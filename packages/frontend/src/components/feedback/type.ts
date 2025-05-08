import { FeedbackType } from '@/components/feedback/enum'

export type FeedbackValue = {
  fromUrl: string
  type?: FeedbackType
}
