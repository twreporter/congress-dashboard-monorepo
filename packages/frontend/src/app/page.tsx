export const dynamic = 'force-dynamic'

// fetcher
import fetchEditorSelecteds from '@/fetchers/server/editor-pickor'
import { fetchLegislativeMeeting } from '@/fetchers/server/legislative-meeting'
import { fetchTopNTopics } from '@/fetchers/server/topic'
import { fetchParty } from '@/fetchers/server/party'
// utils
import { getImageLink } from '@/fetchers/utils'
// components
import Open from '@/components/open'
import Dashboard from '@/components/dashboard'
// lodash
import { find } from 'lodash'
const _ = {
  find,
}

export default async function Home() {
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
    topic.legislators = topic.legislators
      ? topic.legislators.map((legislator) => {
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
      : []
  })

  return (
    <div>
      <Open selecteds={selecteds} />
      <Dashboard initialTopics={topics} parties={parties} meetings={meetings} />
    </div>
  )
}
