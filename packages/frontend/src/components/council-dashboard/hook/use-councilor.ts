import { useState } from 'react'
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
import { shuffle, map, find } from 'lodash'
const _ = {
  shuffle,
  map,
  find,
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

  const fetchCouncilorAndTopTopics = async ({
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
  }

  const loadMoreCouncilorAndTopTopics = async ({
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
    const moreCouncilors = councilors.map((councilor) => {
      const top5Topic = _.find(top5Topics, ({ id }) => id === councilor.id)
      return {
        ...councilor,
        tags: top5Topic?.topics || [],
      }
    })

    return {
      data: moreCouncilors,
      hasMore: moreCouncilors.length === take && skip + take < pool.length,
    }
  }

  return { fetchCouncilorAndTopTopics, loadMoreCouncilorAndTopTopics }
}

export default useCouncilor
