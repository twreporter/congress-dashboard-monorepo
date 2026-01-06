import { useMemo } from 'react'
// type
import type {
  CouncilTopic,
  CouncilTopicFromRes,
  RelatedTopicInOtherCity,
} from '@/types/council-topic'
import type { BillMeta } from '@/types/council-bill'
import type { CouncilorWithBillCount } from '@/types/councilor'
import type { CouncilDistrict } from '@/types/council'
import type {
  RelatedItem,
  RelatedItemFromRes,
} from '@/types/related-twreporter-item'
// utils
import { getImageLink, sortByCountDesc } from '@/fetchers/utils'
import { isValidCouncil } from '@/utils/council'
import { isValidTwreporterItem } from '@/utils/validate-twreporter-item'
// lodash
import groupBy from 'lodash/groupBy'
import flatMap from 'lodash/flatMap'
import get from 'lodash/get'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'
const _ = {
  flatMap,
  get,
  map,
  groupBy,
  mapValues,
}

type GroupedBillByCouncilorSlug = Record<string, BillMeta[]>

type CouncilTopicPageData = {
  topic: CouncilTopic
  councilorCount: number
  councilors: CouncilorWithBillCount[]
  billsByCouncilor: GroupedBillByCouncilorSlug
}

type GetRelatedTwreporterItemFunc = (
  relatedItem?: RelatedItemFromRes[]
) => RelatedItem[]
const getRelatedTwreporterItems: GetRelatedTwreporterItemFunc = (
  relatedItems
) => {
  if (!relatedItems || relatedItems.length === 0) {
    return []
  }
  return relatedItems.reduce((acc: RelatedItem[], item) => {
    if (isValidTwreporterItem(item)) {
      acc.push(item)
    }
    return acc
  }, [])
}

type GetRelatedTopicFromOtherCityFunc = (
  topics?: { slug: string; title: string; city: string }[]
) => RelatedTopicInOtherCity[]
const getRelatedTopicFromOtherCity: GetRelatedTopicFromOtherCityFunc = (
  topics
) => {
  if (!topics || topics.length === 0) {
    return []
  }
  return topics.reduce((acc: RelatedTopicInOtherCity[], { city, ...props }) => {
    if (isValidCouncil(city)) {
      acc.push({ city, ...props })
    }
    return acc
  }, [])
}

export const useTopicData = (
  topicData: CouncilTopicFromRes | undefined
): CouncilTopicPageData => {
  return useMemo(() => {
    const isTopicDataInvalid =
      !topicData ||
      !topicData.bill ||
      topicData.bill.length === 0 ||
      !isValidCouncil(topicData.city)
    if (isTopicDataInvalid) {
      return {
        topic: {
          slug: '',
          title: '',
          city: 'taipei',
          billCount: -1,
        },
        councilorCount: 0,
        councilors: [],
        billsByCouncilor: {},
      }
    }

    const topic = {
      slug: topicData.slug,
      title: topicData.title,
      city: topicData.city as CouncilDistrict,
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

    const billsByCouncilor: GroupedBillByCouncilorSlug = {}
    let councilorCount: number = 0
    let councilors: CouncilorWithBillCount[] = []

    topicData.bill.forEach(({ councilMember, ...bill }) => {
      councilMember.forEach(({ councilor }) => {
        const slug = councilor.slug
        if (!billsByCouncilor[slug]) {
          billsByCouncilor[slug] = [bill]
          councilorCount++
          councilors.push({
            slug,
            name: councilor.name,
            avatar: getImageLink(councilor),
            count: 1,
          })
        } else {
          billsByCouncilor[slug].push(bill)
          const existingCouncilor = councilors.find(
            (councilorWithCount) => councilorWithCount.slug === slug
          )
          if (existingCouncilor) {
            existingCouncilor.count += 1
          }
        }
      })
    })
    councilors = councilors.sort(sortByCountDesc)

    return { topic, councilorCount, councilors, billsByCouncilor }
  }, [topicData])
}

export default useTopicData
