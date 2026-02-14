import type { LegislatorBase } from '@/types/legislator'

type SpeechBaseData = {
  slug: string
  title: string
  date: string
}

export type SpeechFromRes = SpeechBaseData & {
  summary?: string
  legislativeYuanMember: {
    legislator: {
      name: string
      slug: string
    }
  }
  attendee?: string
  topics?: {
    title: string
    slug: string
  }[]
  content?: string
  ivodLink?: string
  ivodStartTime?: string
}

export type SpeechData = SpeechBaseData & {
  summary: string | string[]
  legislator: {
    name: string
    slug: string
  }
  attendee: string
  relatedTopics: {
    title: string
    slug: string
  }[]
  content: string
  iVODLink: string
}

export type SpeechDataForSidebar = SpeechBaseData & {
  summaryFallback: string
}

export type SpeechDataForTopic = SpeechBaseData & {
  summaryFallback: string
  legislativeYuanMember: {
    legislator: LegislatorBase
  }
}
