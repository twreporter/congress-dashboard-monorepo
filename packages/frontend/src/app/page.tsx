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
  try {
    const [selecteds, meetings] = await Promise.all([
      fetchEditorSelecteds(),
      fetchLegislativeMeeting(),
    ])
    const latestMeetingId = meetings[0]?.id
    const [topics = [], parties] = await Promise.all([
      fetchTopNTopics({
        take: 10,
        skip: 0,
        legislativeMeetingId: latestMeetingId,
      }),
      fetchParty(),
    ])
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
        <Dashboard
          initialTopics={topics}
          parties={parties}
          meetings={meetings}
        />
      </div>
    )
  } catch (err) {
    logger.error({ err }, 'Failed to fetch home page data')
    return <div>Failed to load home page data. Please try again later.</div>
  }
}
