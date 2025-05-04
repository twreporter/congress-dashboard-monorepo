export const dynamic = 'force-dynamic'

// fetcher
import fetchEditorSelecteds from '@/fetchers/server/editor-pickor'
import { fetchLegislativeMeeting } from '@/fetchers/server/legislative-meeting'
import { fetchTopNTopics } from '@/fetchers/server/topic'
import { fetchParty } from '@/fetchers/server/party'
// utils
import { getImageLink } from '@/fetchers/utils'
import logger from '@/utils/logger'
// components
import Open from '@/components/open'
import Dashboard from '@/components/dashboard'
// lodash
import { find } from 'lodash'
const _ = {
  find,
}

export default async function Home() {
  logger.debug('start to fetch editor selecteds & meetings...')
  const [selecteds, meetings] = await Promise.all([
    fetchEditorSelecteds(),
    fetchLegislativeMeeting(),
  ])
  logger.debug({ selecteds, meetings }, 'fetch selecteds & meetings done.')
  const latestMeetingId = meetings[0]?.id
  logger.debug('start to fetch top topics & party...')
  const [topics = [], parties] = await Promise.all([
    fetchTopNTopics({
      take: 10,
      skip: 0,
      legislativeMeetingId: latestMeetingId,
    }),
    fetchParty(),
  ])
  logger.debug({ topics, parties }, 'fetch top topics & party done.')
  topics.forEach((topic) => {
    topic.legislators = topic.legislators.map((legislator) => {
      const partyData = legislator.party
        ? _.find(parties, ({ id }) => id === legislator.party)
        : undefined
      return {
        avatar: getImageLink(legislator),
        partyAvatar: partyData ? getImageLink(partyData) : '',
        party: partyData,
        ...legislator,
      }
    })
  })

  return (
    <div>
      <Open selecteds={selecteds} />
      <Dashboard initialTopics={topics} parties={parties} meetings={meetings} />
    </div>
  )
}
