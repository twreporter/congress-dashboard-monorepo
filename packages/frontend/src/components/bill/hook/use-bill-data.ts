import { useMemo } from 'react'
// type
import type { BillFromRes, BillData } from '@/types/council-bill'
// utils
import { formatDate } from '@/utils/date-formatters'
import { summaryParser } from '@/utils/string-parser'

export const useBillData = (billData: BillFromRes): BillData => {
  return useMemo(() => {
    return {
      slug: billData.slug,
      date: formatDate(billData.date, 'YYYY/M/D'),
      title: billData.title,
      attendee: billData.attendee,
      summary: billData.summary ? summaryParser(billData.summary) : '',
      content: billData.content || '',
      relatedTopics: billData.topic,
      sourceLink: billData.sourceLink || '',
      councilors: billData.councilMember?.map(({ councilor, city }) => ({
        city,
        ...councilor,
      })),
    }
  }, [billData])
}
