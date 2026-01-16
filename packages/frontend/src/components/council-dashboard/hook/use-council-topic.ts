import { useCallback } from 'react'
// fetcher
import { fetchTopNCouncilTopics } from '@/fetchers/council-topic'
// utils
import { getImageLink } from '@/fetchers/utils'
// type
import type { FetchTopNTopicsParams } from '@/fetchers/server/council-topic'
import type { PartyData } from '@/types/party'
// lodash
import { find } from 'lodash'
const _ = {
  find,
}

const useCouncilTopic = (parties: PartyData[]) => {
  const fetchTopic = useCallback(
    async ({ take, skip, councilMeetingId }: FetchTopNTopicsParams) => {
      const topics = await fetchTopNCouncilTopics({
        take,
        skip,
        councilMeetingId,
      })
      topics.forEach((topic) => {
        topic.councilors =
          topic.councilors?.map(({ party, ...councilor }) => {
            const partyData = party
              ? _.find(parties, ({ id }) => String(id) === String(party))
              : undefined
            return {
              avatar: getImageLink(councilor),
              partyAvatar: partyData ? getImageLink(partyData) : '',
              party: partyData || party,
              ...councilor,
            }
          }) || []
      })

      return topics
    },
    [parties]
  )

  return fetchTopic
}

export default useCouncilTopic
