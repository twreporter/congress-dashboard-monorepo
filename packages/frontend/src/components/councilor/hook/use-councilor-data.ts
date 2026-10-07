import { useMemo } from 'react'
// @twreporter
import { getDistrictLabel } from '@twreporter/congress-dashboard-shared/lib/constants/city-district'
// type
import type {
  CouncilorMemberData,
  CouncilorForLawmaker,
} from '@/types/councilor'
import type { CouncilTopicForFilter } from '@/types/council-topic'
import type { CouncilDistrict } from '@/types/council'
// utils
import { getImageLink } from '@/fetchers/utils'
// lodash
import get from 'lodash/get'
const _ = {
  get,
}

type CouncilorPageData = {
  councilor: CouncilorForLawmaker
  topics: CouncilTopicForFilter[]
}

const useCouncilorData = (
  slug: string,
  councilorData: CouncilorMemberData,
  topicsData: CouncilTopicForFilter[]
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
        )
          .map((district: string) => getDistrictLabel(city, district) || '')
          // Intentionally omit district codes that have no corresponding label.
          .filter(Boolean),
        note: _.get(councilorData, 'note'),
        tooltip: _.get(councilorData, 'tooltip'),
        proposalSuccessCount: _.get(councilorData, 'proposalSuccessCount', 0),
        speechCount: _.get(councilorData, 'speechCount', 0),
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
          id: _.get(councilorData, 'councilMeeting.id'),
          term: _.get(councilorData, 'councilMeeting.term'),
          city,
        },
      }
    }

    return { councilor: normalizeCouncilorData(), topics: topicsData }
  }, [slug, councilorData, topicsData])
}

export default useCouncilorData
