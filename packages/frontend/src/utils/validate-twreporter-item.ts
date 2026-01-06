import { VALID_TWREPORTER_TYPE } from '@/constants/related-twreporter-item'
import type {
  RelatedType,
  RelatedItem,
  RelatedItemFromRes,
} from '@/types/related-twreporter-item'

function isValidTwreporterItemType(type: string): type is RelatedType {
  return VALID_TWREPORTER_TYPE.includes(type as RelatedType)
}

export function isValidTwreporterItem(
  item: RelatedItemFromRes
): item is RelatedItem {
  if (!item.slug || !isValidTwreporterItemType(item.type)) {
    return false
  }
  return true
}
