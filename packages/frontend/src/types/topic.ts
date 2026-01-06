import type { PartyData } from '@/types/party'
import type { SpeechDataForTopic } from '@/types/speech'
import type { RelatedType } from '@/types/related-twreporter-item'
import type { SpeechDataForSidebar } from '@/types/speech'
import type { KeystoneImage } from '@/types'

export type Topic = {
  slug: string
  name: string
  count: number
}

export type TopicData = {
  slug: string
  title: string
  speechesCount?: number
  speeches?: SpeechDataForTopic[]
  relatedTopics?: {
    slug: string
    title: string
  }[]
  relatedTwreporterArticles?: {
    slug: string
    type: RelatedType
  }[]
}

export type TopNTopicData = {
  slug: string
  title: string
  speechCount: number
  legislatorCount: number
  legislators: {
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

export type TopNTopicForLegislators = {
  id: number
  topics?: {
    id: number
    slug: string
    name: string
    count: number
  }[]
}

export type TopicDataForLegislator = {
  title: string
  slug: string
  speechesCount: number
  speeches: SpeechDataForSidebar[]
}
