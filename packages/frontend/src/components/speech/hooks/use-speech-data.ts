import { useMemo } from 'react'
// type
import type { SpeechFromRes, SpeechData } from '@/types/speech'
// utils
import { formatDate } from '@/utils/date-formatters'

// summary will be like this:
// "<ul><li>this is a long sentence</li><li>this is a long sentence</li></ul>" or "this is a long sentence"
const summaryParser = (summary: string): string | string[] => {
  if (/<ul>[\s\S]*<\/ul>/i.test(summary)) {
    const items = Array.from(summary.matchAll(/<li>([\s\S]*?)<\/li>/gi), (m) =>
      m[1].trim()
    )
    return items
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
