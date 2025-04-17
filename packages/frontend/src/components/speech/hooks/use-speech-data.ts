import { useMemo } from 'react'
// fetcher
import { type SpeechFromRes } from '@/fetchers/server/speech'
// utils
import { formatDate } from '@/utils/date-formatters'

export type SpeechData = {
  slug: string
  date: string
  title: string
  legislator: {
    name: string
    slug: string
  }
  attendee: string
  relatedTopics: {
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

export const useSpeechData = (speechData: SpeechFromRes): SpeechData => {
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
      date: formatDate(date, 'YYYY/M/D'),
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
