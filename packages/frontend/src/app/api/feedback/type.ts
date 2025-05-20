// type
import { ContentDetail, ProductDetail } from '@/components/feedback/type'

type AutoCollectData = {
  fromUrl: string
  userAgent: string
}

type FeedbackContent = ContentDetail & AutoCollectData

type FeedbackProduct = ProductDetail & AutoCollectData

export type Feedback = FeedbackContent | FeedbackProduct
