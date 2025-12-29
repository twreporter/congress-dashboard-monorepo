import type { KeystoneImage } from '@/types'

// todo: check summary type string | string[]
export type BillFromRes = {
  slug: string
  date: string
  title: string
  summary?: string
  content?: string
  attendee?: string
  sourceLink?: string
  topic?: {
    slug: string
    title: string
    city: string
  }[]
  councilMember?: {
    councilor: {
      slug: string
      name: string
    }
    city: string
  }[]
  councilMeeting?: {
    city: string
  }
}

export type BillMeta = {
  slug: string
  date: string
  title: string
  summary: string
}

export type BillMetaWithCouncilorFromRes = BillMeta & {
  councilMember: {
    councilor: {
      slug: string
      name: string
      image?: KeystoneImage
      imageLink?: string
    }
  }[]
}

export type BillData = {
  slug: string
  date: string
  title: string
  summary: string | string[]
  content: string
  attendee?: string
  sourceLink: string
  relatedTopics?: {
    slug: string
    title: string
    city: string
  }[]
  councilors?: {
    slug: string
    name: string
    city: string
  }[]
}
