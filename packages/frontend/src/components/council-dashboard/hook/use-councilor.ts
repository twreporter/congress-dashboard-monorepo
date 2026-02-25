import { useCallback, useRef } from 'react'
// fetcher
import {
  fetchCouncilors,
  fetchTopNTopicsOfCouncilMembers,
} from '@/fetchers/councilor'
// type
import type { CouncilorForDashboard } from '@/components/council-dashboard/type'
// utils
import { getImageLink } from '@/fetchers/utils'
// lodash
import { shuffle, map } from 'lodash'
const _ = {
  shuffle,
  map,
}

type ResponseWithHasMore = {
  data: CouncilorForDashboard[]
  hasMore: boolean
}
type LoadMoreCouncilorAndTopTopics = {
  customCouncilorPool?: CouncilorForDashboard[]
  councilMeetingId: number
  take?: number
  skip?: number
}
type FetchCouncilorAndTopTopicsParams = LoadMoreCouncilorAndTopTopics & {
  partyIds?: number[]
  constituencies?: number[]
  types?: string[]
  administrativeDistricts?: string[]
}

const useCouncilor = () => {
  // Use ref instead of state to avoid recreating callbacks when pool changes
  const councilorPoolRef = useRef<CouncilorForDashboard[]>([])

  const loadMoreCouncilorAndTopTopics = useCallback(
    async ({
      customCouncilorPool,
      councilMeetingId,
      take = 10,
      skip = 0,
    }: LoadMoreCouncilorAndTopTopics): Promise<ResponseWithHasMore> => {
      const pool = customCouncilorPool || councilorPoolRef.current
      const councilors = pool.slice(skip, skip + take)
      const top5Topics = await fetchTopNTopicsOfCouncilMembers({
        councilMemberIds: councilors.map(({ id }) => id!),
        councilMeetingId,
        take: 5,
      })
      const topicsMap = new Map(top5Topics.map((topic) => [topic.id, topic]))
      const moreCouncilors = councilors.map((councilor) => {
        const top5Topic = councilor.id ? topicsMap.get(councilor.id) : undefined
        return {
          ...councilor,
          tags: top5Topic?.topics || [],
        }
      })
      return {
        data: moreCouncilors,
        hasMore: moreCouncilors.length === take && skip + take < pool.length,
      }
    },
    []
  )

  const fetchCouncilorAndTopTopics = useCallback(
    async ({
      councilMeetingId,
      partyIds,
      constituencies,
      types,
      administrativeDistricts,
    }: FetchCouncilorAndTopTopicsParams): Promise<ResponseWithHasMore> => {
      const councilMembers = await fetchCouncilors({
        councilMeetingId,
        partyIds,
        constituencies,
        types,
      })
      let councilors = _.shuffle(
        _.map(councilMembers, ({ councilor, party, id, ...rest }) => ({
          ...rest,
          ...councilor,
          id: Number(id),
          avatar: getImageLink(councilor),
          partyAvatar: getImageLink(party),
        }))
      )

      if (administrativeDistricts && administrativeDistricts.length > 0) {
        councilors = councilors.filter((councilor) => {
          const districts = (councilor as Record<string, unknown>)
            .administrativeDistrict as string[] | undefined
          if (!districts || !Array.isArray(districts)) return false
          return administrativeDistricts.some((d) => districts.includes(d))
        })
      }

      councilorPoolRef.current = councilors

      // load councilor data with top 5 topics meta
      const { data, hasMore } = await loadMoreCouncilorAndTopTopics({
        customCouncilorPool: councilors,
        councilMeetingId,
        take: 10,
        skip: 0,
      })
      return { data, hasMore }
    },
    [loadMoreCouncilorAndTopTopics]
  )

  return { fetchCouncilorAndTopTopics, loadMoreCouncilorAndTopTopics }
}

export default useCouncilor
