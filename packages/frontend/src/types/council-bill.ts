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
}

export type BillMeta = {
  slug: string
  date: string
  title: string
  summary: string
}

export type BillData = BillMeta & {
  content: string
  attendee?: string
  sourceLink?: string
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
