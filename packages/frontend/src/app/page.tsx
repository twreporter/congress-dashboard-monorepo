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
import Error from '@/components/error'
// type
import type { ErrorType } from '@/components/error/type'
// lodash
import { find } from 'lodash'
const _ = {
  find,
}

export default async function Home() {
  try {
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
        <Dashboard
          initialTopics={topics}
          parties={parties}
          meetings={meetings}
        />
      </div>
    )
  } catch (err) {
    logger.error({ err }, 'Failed to fetch home page data')

    const errValue = err as ErrorType
    return (
      <Error
        title={'Failed to load home page data. Please try again later.'}
        error={errValue}
      />
    )
  }
}
