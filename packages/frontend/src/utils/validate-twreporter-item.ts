import type {
  RelatedItem,
  RelatedItemFromRes,
} from '@/types/related-twreporter-item'

const validType = ['www-topic', 'www-article'] as const

export type ValidTwreporterItemType = (typeof validType)[number]

function isValidTwreporterItemType(
  type: string
): type is ValidTwreporterItemType {
  return validType.includes(type as ValidTwreporterItemType)
}

export function isValidTwreporterItem(
  item: RelatedItemFromRes
): item is RelatedItem {
  if (!item.slug || !isValidTwreporterItemType(item.type)) {
    return false
  }
  return true
}
