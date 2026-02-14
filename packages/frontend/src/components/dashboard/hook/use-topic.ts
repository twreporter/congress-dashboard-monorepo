import { useCallback } from 'react'
// fetcher
import { fetchTopNTopics } from '@/fetchers/topic'
// utils
import { getImageLink } from '@/fetchers/utils'
// type
import type { FetchTopNTopicsParams } from '@/fetchers/server/topic'
import type { PartyData } from '@/types/party'
// lodash
import { find } from 'lodash'
const _ = {
  find,
}

const useTopic = (parties: PartyData[]) => {
  const fetchTopic = useCallback(
    async ({
      take,
      skip,
      legislativeMeetingId,
      legislativeMeetingSessionIds,
    }: FetchTopNTopicsParams) => {
      const topics = await fetchTopNTopics({
        take,
        skip,
        legislativeMeetingId,
        legislativeMeetingSessionIds,
      })
      topics.forEach((topic) => {
        topic.legislators =
          topic.legislators?.map(({ party, ...legislator }) => {
            const partyData = party
              ? _.find(parties, ({ id }) => String(id) === String(party))
              : undefined
            return {
              avatar: getImageLink(legislator),
              partyAvatar: partyData ? getImageLink(partyData) : '',
              party: partyData || party,
              ...legislator,
            }
          }) || []
      })

      return topics
    },
    [parties]
  )

  return fetchTopic
}

export default useTopic
