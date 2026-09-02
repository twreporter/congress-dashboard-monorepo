import type { CouncilDistrict } from '@/types/council'

type SpeechBaseData = {
  slug: string
  title: string
  date: string
}

export type CouncilSpeechFromRes = SpeechBaseData & {
  summary?: string
  councilMember?: {
    city: string
    councilor: {
      name: string
      slug: string
    }
  }[]
  attendee?: string
  topic?: {
    title: string
    slug: string
    city: string
  }[]
  content?: string
  sourceLink?: string
}

export type CouncilSpeechData = SpeechBaseData & {
  summary: string | string[]
  councilors: {
    name: string
    slug: string
    city: CouncilDistrict
  }[]
  attendee: string
  relatedTopics: {
    title: string
    slug: string
    city: CouncilDistrict
  }[]
  content: string
  sourceLink: string
}
