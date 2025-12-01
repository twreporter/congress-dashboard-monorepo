import type { KeystoneImage } from '@/types'

export type PartyData = {
  id: number
  slug: string
  name: string
  imageLink?: string
  image?: KeystoneImage
}