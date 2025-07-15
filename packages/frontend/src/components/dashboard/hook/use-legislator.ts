import { useState } from 'react'
// fetcher
import {
  fetchLegislators,
  fetchTopNTopicsOfLegislators,
} from '@/fetchers/legislator'
// type
import type { Legislator } from '@/components/dashboard/type'
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
  data: Legislator[]
  hasMore: boolean
}
type LoadMoreLegislatorAndTopTopics = {
  customLegislatorPool?: Legislator[]
  legislativeMeetingId: number
  legislativeMeetingSessionIds?: number[]
  take?: number
  skip?: number
}
type FetchLegislatorAndTopTopicsParams = LoadMoreLegislatorAndTopTopics & {
  partyIds?: number[]
  constituencies?: string[]
  committeeSlugs?: string[]
}

const useLegislator = () => {
  const [legislatorPool, setLegislatorPool] = useState<Legislator[]>([])

  const fetchLegislatorAndTopTopics = async ({
    legislativeMeetingId,
    legislativeMeetingSessionIds,
    partyIds,
    constituencies,
    committeeSlugs,
  }: FetchLegislatorAndTopTopicsParams): Promise<ResponseWithHasMore> => {
    const legislatorYuanMembers = await fetchLegislators({
      legislativeMeetingId,
      legislativeMeetingSessionIds,
      partyIds,
      constituencies,
      committeeSlugs,
    })
    const legislators = _.shuffle(
      _.map(legislatorYuanMembers, ({ legislator, party, id, ...rest }) => ({
        ...rest,
        ...legislator,
        id: Number(id),
        avatar: getImageLink(legislator),
        partyAvatar: getImageLink(party),
      }))
    )
    setLegislatorPool(legislators)

    // load legislator data with top 5 topics meta
    const { data, hasMore } = await loadMoreLegislatorAndTopTopics({
      customLegislatorPool: legislators,
      legislativeMeetingId,
      legislativeMeetingSessionIds,
      take: 10,
      skip: 0,
    })
    return { data, hasMore }
  }

  const loadMoreLegislatorAndTopTopics = async ({
    customLegislatorPool,
    legislativeMeetingId,
    legislativeMeetingSessionIds,
    take = 10,
    skip = 0,
  }: LoadMoreLegislatorAndTopTopics): Promise<ResponseWithHasMore> => {
    const pool = customLegislatorPool || legislatorPool
    const legislators = pool.slice(skip, skip + take)
    const top5Topics = await fetchTopNTopicsOfLegislators({
      legislatorIds: legislators.map(({ id }) => id!),
      legislativeMeetingId,
      legislativeMeetingSessionIds,
      take: 5,
    })
    const moreLegislators = legislators.map((legislator) => {
      const top5Topic = _.find(top5Topics, ({ id }) => id === legislator.id)
      return {
        ...legislator,
        tags: top5Topic?.topics || [],
      }
    })

    // log for debug
    console.log(
      `#data: ${moreLegislators.length}, #pool: ${pool.length}, skip: ${skip}, take: ${take}`
    )
    console.log(
      'hasMore',
      moreLegislators.length === take && skip + take < pool.length
    )

    return {
      data: moreLegislators,
      hasMore: moreLegislators.length === take && skip + take < pool.length,
    }
  }

  return { fetchLegislatorAndTopTopics, loadMoreLegislatorAndTopTopics }
}

export default useLegislator
