type InstanceWithImage = {
  imageLink?: string
  image?: { imageFile: { url: string } }
}
export function getImageLink(item: InstanceWithImage) {
  const selfHostImage = item.image?.imageFile?.url
  const imageUrl =
    item.imageLink ||
    (selfHostImage
      ? `${process.env.NEXT_PUBLIC_IMAGE_HOST}${selfHostImage}`
      : '')

  return imageUrl
}

type InstanceWithCount = {
  count: number
}
export const sortByCountDesc = (a: InstanceWithCount, b: InstanceWithCount) =>
  b.count - a.count
