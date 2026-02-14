import { useMemo } from 'react'
// @twreporter
import { getDistrictLabel } from '@twreporter/congress-dashboard-shared/lib/constants/city-district'
// type
import type {
  CouncilorMemberData,
  CouncilorForLawmaker,
} from '@/types/councilor'
import type { CouncilTopicOfBillData } from '@/types/council-topic'
import type { Topic } from '@/types/topic'
import type { CouncilDistrict } from '@/types/council'
import type { BillMeta } from '@/types/council-bill'
// utils
import { getImageLink, sortByCountDesc } from '@/fetchers/utils'
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

type CouncilorPageData = {
  councilor: CouncilorForLawmaker
  topics: Topic[]
  billsByTopic: Record<string, BillMeta[]>
}

const useCouncilorData = (
  slug: string,
  councilorData: CouncilorMemberData,
  topicsData: CouncilTopicOfBillData[]
): CouncilorPageData => {
  return useMemo(() => {
    const normalizeCouncilorData = (): CouncilorForLawmaker => {
      const city = councilorData.councilMeeting.city as CouncilDistrict
      return {
        slug,
        name: _.get(councilorData, 'councilor.name'),
        avatar: getImageLink(councilorData.councilor),
        city,
        type: _.get(councilorData, 'type'),
        constituency: _.get(councilorData, 'constituency'),
        administrativeDistrict: _.get(
          councilorData,
          'administrativeDistrict',
          []
        ).map((district: string) => getDistrictLabel(city, district) || ''),
        note: _.get(councilorData, 'note'),
        tooltip: _.get(councilorData, 'tooltip'),
        proposalSuccessCount: _.get(councilorData, 'proposalSuccessCount', 0),
        relatedLink: _.get(councilorData, 'relatedLink', []),
        externalLink: _.get(councilorData, 'councilor.externalLink'),
        meetingTermCount: _.get(councilorData, 'councilor.meetingTermCount', 0),
        meetingTermCountInfo: _.get(
          councilorData,
          'councilor.meetingTermCountInfo',
          ''
        ),
        isActive: _.get(councilorData, 'isActive'),
        party: {
          name: _.get(councilorData, 'party.name'),
          image: getImageLink(councilorData.party),
        },
        councilMeeting: {
          term: _.get(councilorData, 'councilMeeting.term'),
          city,
        },
      }
    }

    const topics: Topic[] = _.map(topicsData, (topic) => ({
      slug: topic.slug,
      name: topic.title,
      count: topic.billCount,
    })).sort(sortByCountDesc)

    const billsByTopic = _.mapValues(_.groupBy(topicsData, 'slug'), (topics) =>
      _.flatMap(topics, (topic) => topic.bill || [])
    )

    return { councilor: normalizeCouncilorData(), topics, billsByTopic }
  }, [slug, councilorData, topicsData])
}

export default useCouncilorData
