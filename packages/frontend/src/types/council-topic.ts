// types
import type {
  BillMeta,
  BillMetaWithCouncilorFromRes,
} from '@/types/council-bill'
import type { RelatedType } from '@/types/related-twreporter-item'
import type { CouncilDistrict } from '@/types/council'
import type { PartyData } from '@/types/party'
import type { KeystoneImage } from '@/types'
import type { Tag } from '@/components/dashboard/type'

export type CouncilTopicOfBillData = {
  slug: string
  title: string
  billCount: number
  bill: BillMeta[]
}

export type CouncilTopicForFilter = {
  slug: string
  title: string
  count: number
}

export type RelatedTopic = {
  slug: string
  title: string
  type?: string
  billCount?: number
}

export type RelatedTopicInOtherCity = RelatedTopic & {
  city: CouncilDistrict
}

export type CouncilTopic = {
  slug: string
  title: string
  city: CouncilDistrict
  billCount: number
  relatedTwreporterArticle?: {
    slug: string
    type: RelatedType
  }[]
  relatedCityCouncilTopic?: RelatedTopic[]
  relatedCouncilTopic?: RelatedTopicInOtherCity[]
  relatedLegislativeTopic?: RelatedTopic[]
}

export type CouncilTopicFromRes = {
  slug: string
  title: string
  city: string
  billCount: number
  bill: BillMetaWithCouncilorFromRes[]
  relatedTwreporterArticle?: {
    slug: string
    type: string
  }[]
  relatedCityCouncilTopic?: {
    slug: string
    title: string
    type?: string
    billCount?: number
  }[]
  relatedCouncilTopic?: {
    slug: string
    title: string
    city: string
  }[]
  relatedLegislativeTopic?: {
    slug: string
    title: string
  }[]
}

export type TopNCouncilTopicData = {
  slug: string
  title: string
  billCount: number
  councilorCount: number
  councilors: {
    id: number
    count: number
    name?: string
    slug: string
    party?: number | PartyData
    imageLink?: string
    image?: KeystoneImage
    avatar?: string
    partyAvatar?: string
  }[]
}

export type TopNTopicForCouncilors = {
  id: number
  topics: Tag[]
}

export type FeaturedCouncilTopicData = {
  title: string
  slug: string
  city: string
  billCount: number
  councilorCount: number
  avatars: string[]
}
