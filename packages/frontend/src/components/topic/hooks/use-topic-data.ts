import { useMemo } from 'react'
// fetcher
import { type TopicData } from '@/fetchers/server/topic'
// util
import { getImageLink } from '@/fetchers/utils'
// lodash
import groupBy from 'lodash/groupBy'

const _ = {
  groupBy,
}

export const useTopicData = (topic: TopicData | null) => {
  return useMemo(() => {
    if (!topic?.speeches || !topic.speeches.length) {
      return {
        legislatorCount: 0,
        legislatorsData: [],
        speechesByLegislator: {},
      }
    }
    const speechesByLegislator = _.groupBy(
      topic.speeches,
      (speech) => speech.legislativeYuanMember.legislator.slug
    )
    const legislatorCount = Object.keys(speechesByLegislator).length
    const legislatorsData = Object.entries(speechesByLegislator)
      .map(([slug, speeches]) => ({
        name: speeches[0].legislativeYuanMember.legislator.name,
        slug,
        avatar: getImageLink(speeches[0].legislativeYuanMember.legislator),
        count: speeches.length,
      }))
      .sort((a, b) => b.count - a.count)
    return { legislatorCount, legislatorsData, speechesByLegislator }
  }, [topic?.speeches])
}
