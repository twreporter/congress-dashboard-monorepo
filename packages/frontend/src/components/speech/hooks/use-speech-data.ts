import { useMemo } from 'react'
// fetcher
import { type SpeechFromRes } from '@/fetchers/server/speech'

export type SpeechData = {
  slug: string
  date: string
  title: string
  legislator: {
    name: string
    slug: string
  }
  attendee: string
  topics: {
    title: string
    slug: string
  }[]
  summary: string | string[]
  content: string
  iVODLink: string
}
// summary will be like this:
// "[this is a long sentence], [this is a long sentence], [this is a long sentence]" or "this is a long sentence"
const summaryParser = (summary: string): string | string[] => {
  if (summary.startsWith('[') && summary.endsWith(']')) {
    return summary.split('],').map((str) => str.replace(/[\[\]]/g, '').trim())
  }
  return summary
}

export const useSpeechData = (speechData: SpeechFromRes) => {
  return useMemo(() => {
    const {
      slug,
      date,
      title,
      legislativeYuanMember: { legislator },
      attendee = '',
      topics = [],
      summary = '',
      content = '',
      ivodLink = '',
    } = speechData

    return {
      slug,
      date,
      title,
      legislator,
      attendee,
      relatedTopics: topics,
      summary: summary ? summaryParser(summary) : '',
      content,
      iVODLink: ivodLink,
    }
  }, [speechData])
}
