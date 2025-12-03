import { useMemo } from 'react'
// type
import type { SpeechFromRes, SpeechData } from '@/types/speech'
// utils
import { formatDate } from '@/utils/date-formatters'
import { summaryParser } from '@/utils/string-parser'

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
