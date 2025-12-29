import { VALID_TWREPORTER_TYPE } from '@/constants/related-twreporter-item'

export type RelatedType = (typeof VALID_TWREPORTER_TYPE)[number]

export type RelatedItemFromRes = {
  type: string
  slug: string
}

export type RelatedItem = {
  type: RelatedType
  slug: string
}

export type RelatedItemData = {
  category?: string
  publishedDate?: string
  title: string
  image?: {
    description?: string
    url?: string
  }
  style?: string
  url: string
}
