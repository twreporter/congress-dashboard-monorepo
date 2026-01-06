import type { KeystoneImage } from '@/types'

type InstanceWithImage = {
  imageLink?: string
  image?: KeystoneImage
}
export function getImageLink(item: InstanceWithImage) {
  const selfHostImage = item?.image?.imageFile?.url
  const fallbackLink = item?.imageLink ?? ''
  const imageUrl = selfHostImage
    ? `${process.env.NEXT_PUBLIC_IMAGE_HOST}${selfHostImage}`
    : fallbackLink

  return imageUrl
}

type InstanceWithCount = {
  count: number
}
export const sortByCountDesc = (a: InstanceWithCount, b: InstanceWithCount) =>
  b.count - a.count
