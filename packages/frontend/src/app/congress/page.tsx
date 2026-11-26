// home page cache is on cloudflare
export const dynamic = 'force-dynamic'

// fetcher
import fetchEditorSelecteds from '@/fetchers/server/editor-pick'
import { fetchLegislativeMeeting } from '@/fetchers/server/legislative-meeting'
import { fetchTopNTopics } from '@/fetchers/server/topic'
import { fetchParty } from '@/fetchers/server/party'
// utils
import { getImageLink } from '@/fetchers/utils'
// components
import Open from '@/components/open'
import Dashboard from '@/components/dashboard'
import { Option } from '@/components/dashboard/enum'
// lodash
import { find } from 'lodash'
const _ = {
  find,
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const initialTab = tab === 'legislator' ? Option.Human : Option.Issue
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
      ? topic.legislators.map(({ party, ...legislator }) => {
          const partyData = party
            ? _.find(parties, ({ id }) => String(id) === String(party))
            : undefined
          return {
            avatar: getImageLink(legislator),
            partyAvatar: partyData ? getImageLink(partyData) : '',
            party: partyData || party,
            ...legislator,
          }
        })
      : []
  })

  return (
    <div>
      <Open selecteds={selecteds} />
      <Dashboard
        initialTopics={topics}
        parties={parties}
        meetings={meetings}
        initialTab={initialTab}
      />
    </div>
  )
}
