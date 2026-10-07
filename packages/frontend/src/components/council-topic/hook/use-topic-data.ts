import { useMemo } from 'react'
import type {
  CouncilTopic,
  CouncilTopicFromRes,
  RelatedTopicInOtherCity,
} from '@/types/council-topic'
import type { CouncilorWithWorkCounts } from '@/types/councilor'
import type { CouncilDistrict } from '@/types/council'
import type {
  RelatedItem,
  RelatedItemFromRes,
} from '@/types/related-twreporter-item'
import { isValidCouncil } from '@/utils/council'
import { isValidTwreporterItem } from '@/utils/validate-twreporter-item'

type CouncilTopicPageData = {
  topic: CouncilTopic
  speechCouncilorCount: number
  billCouncilorCount: number
  councilors: CouncilorWithWorkCounts[]
}

const getRelatedTwreporterItems = (
  relatedItems?: RelatedItemFromRes[]
): RelatedItem[] =>
  (relatedItems || []).filter(isValidTwreporterItem) as RelatedItem[]

const getRelatedTopicFromOtherCity = (
  topics?: { slug: string; title: string; city: string }[]
): RelatedTopicInOtherCity[] =>
  (topics || []).reduce<RelatedTopicInOtherCity[]>(
    (result, { city, ...topic }) => {
      if (isValidCouncil(city)) result.push({ city, ...topic })
      return result
    },
    []
  )

export const useTopicData = (
  topicData: CouncilTopicFromRes,
  councilors: CouncilorWithWorkCounts[]
): CouncilTopicPageData =>
  useMemo(() => {
    const city = isValidCouncil(topicData.city) ? topicData.city : 'taipei'
    const topic: CouncilTopic = {
      slug: topicData.slug,
      title: topicData.title,
      city: city as CouncilDistrict,
      speechCount: topicData.speechCount,
      billCount: topicData.billCount,
      relatedTwreporterArticle: getRelatedTwreporterItems(
        topicData.relatedTwreporterArticle
      ),
      relatedCityCouncilTopic: topicData.relatedCityCouncilTopic,
      relatedCouncilTopic: getRelatedTopicFromOtherCity(
        topicData.relatedCouncilTopic
      ),
      relatedLegislativeTopic: topicData.relatedLegislativeTopic,
    }

    return {
      topic,
      speechCouncilorCount: councilors.filter(
        ({ speechCount }) => speechCount > 0
      ).length,
      billCouncilorCount: councilors.filter(({ billCount }) => billCount > 0)
        .length,
      councilors,
    }
  }, [topicData, councilors])

export default useTopicData
