import { CouncilDistrict } from '@/types/council'

export type ValuesOf<T> = T[keyof T]

export type KeystoneImage = {
  imageFile: {
    url: string
  }
}

export type SitemapItem = {
  slug: string
  updatedAt: string
}

export type SitemapItemWithCity = {
  slug: string
  city: CouncilDistrict
  updatedAt: string
}
