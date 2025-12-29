import type { ValidTwreporterItemType } from '@/utils/validate-twreporter-item'

export type RelatedType = ValidTwreporterItemType

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
