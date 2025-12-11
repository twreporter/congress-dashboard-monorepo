export type RelatedType = 'www-topic' | 'www-article'

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
