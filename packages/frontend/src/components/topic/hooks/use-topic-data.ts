import { useMemo } from 'react'
import { type TopicData } from '@/fetchers/topic'
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
    const legislatorsData = Object.entries(speechesByLegislator).map(
      ([slug, speeches]) => ({
        name: speeches[0].legislativeYuanMember.legislator.name,
        slug,
        imageLink:
          speeches[0].legislativeYuanMember.legislator.image?.imageFile?.url ||
          speeches[0].legislativeYuanMember.legislator.imageLink,
        count: speeches.length,
      })
    )
    return { legislatorCount, legislatorsData, speechesByLegislator }
  }, [topic?.speeches])
}
