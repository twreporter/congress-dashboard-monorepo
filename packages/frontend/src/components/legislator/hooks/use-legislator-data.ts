import { useMemo } from 'react'
// fetcher
import {
  type LegislatorFromRes,
  type TopicData,
} from '@/fetchers/server/legislator'
// utils
import { getImageLink } from '@/fetchers/utils'
// @twreporter
import {
  MEMBER_TYPE_LABEL,
  MemberType,
  CONSTITUENCY_LABEL,
} from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'
// lodash
import groupBy from 'lodash/groupBy'
import flatMap from 'lodash/flatMap'
import get from 'lodash/get'
import countBy from 'lodash/countBy'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'
const _ = {
  flatMap,
  get,
  countBy,
  map,
  groupBy,
  mapValues,
}

export type Legislator = {
  name: string
  slug: string
  constituency: string
  avatar: string
  party: {
    name: string
    image: string
  }
  tooltip?: string
  meetingTerm: number
  committees: {
    name: string
    count: number
  }[]
  proposalSuccessCount?: number
  externalLink?: string
  meetingTermCount: number
  meetingTermCountInfo?: string
}

export const useLegislatorData = (
  legislatorData: LegislatorFromRes,
  topicsData: TopicData[]
) => {
  return useMemo(() => {
    const legislator = () => {
      const {
        party,
        tooltip,
        legislativeMeeting: meeting,
        constituency,
        type,
        sessionAndCommittee,
        legislator,
        proposalSuccessCount,
      } = legislatorData
      const legislatorName = legislator.name
      const legislatorAvatar = getImageLink(legislator)
      const LegislatorConstituency =
        type !== MemberType.Constituency
          ? MEMBER_TYPE_LABEL[type]
          : CONSTITUENCY_LABEL[constituency]
      const legislatorParty = {
        name: party.name,
        image: getImageLink(party),
      }
      const meetingTerm = meeting.term
      // 獲取所有委員會
      const allCommittees = _.flatMap(sessionAndCommittee, (session) =>
        _.get(session, 'committee', [])
      )
      // 計算每個委員會的出現次數
      const committeeCounts = _.countBy(allCommittees, 'name')
      const committees = _.map(committeeCounts, (count, name) => ({
        name,
        count,
      }))
      return {
        name: legislatorName,
        slug: legislator.slug,
        constituency: LegislatorConstituency,
        avatar: legislatorAvatar,
        party: legislatorParty,
        tooltip,
        meetingTerm,
        committees,
        proposalSuccessCount: proposalSuccessCount || 0,
        externalLink: legislator.externalLink || '',
        meetingTermCount: legislator.meetingTermCount || 1,
        meetingTermCountInfo: legislator.meetingTermCountInfo || '',
      }
    }

    const topics = _.map(topicsData, (topic) => ({
      slug: topic.slug,
      name: topic.title,
      count: topic.speechesCount,
    }))

    const speechesByTopic = _.mapValues(
      _.groupBy(topicsData, 'slug'),
      (topics) => _.flatMap(topics, (topic) => topic.speeches || [])
    )

    return { legislator: legislator(), topics, speechesByTopic }
  }, [legislatorData, topicsData])
}
