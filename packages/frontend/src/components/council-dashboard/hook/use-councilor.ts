import { useState, useCallback } from 'react'
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
}

const useCouncilor = () => {
  const [councilorPool, setCouncilorPool] = useState<CouncilorForDashboard[]>(
    []
  )

  const loadMoreCouncilorAndTopTopics = useCallback(
    async ({
      customCouncilorPool,
      councilMeetingId,
      take = 10,
      skip = 0,
    }: LoadMoreCouncilorAndTopTopics): Promise<ResponseWithHasMore> => {
      const pool = customCouncilorPool || councilorPool
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
    [councilorPool]
  )

  const fetchCouncilorAndTopTopics = useCallback(
    async ({
      councilMeetingId,
      partyIds,
      constituencies,
    }: FetchCouncilorAndTopTopicsParams): Promise<ResponseWithHasMore> => {
      const councilMembers = await fetchCouncilors({
        councilMeetingId,
        partyIds,
        constituencies,
      })
      const councilors = _.shuffle(
        _.map(councilMembers, ({ councilor, party, id, ...rest }) => ({
          ...rest,
          ...councilor,
          id: Number(id),
          avatar: getImageLink(councilor),
          partyAvatar: getImageLink(party),
        }))
      )
      setCouncilorPool(councilors)

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
