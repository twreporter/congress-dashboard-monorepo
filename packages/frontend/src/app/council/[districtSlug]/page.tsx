// TODO: temporary placeholder page
import React from 'react'
import { notFound } from 'next/navigation'
// constants
import { VALID_COUNCILS } from '@/constants/council'
// fetcher
import { fetchParty } from '@/fetchers/server/party'
import { fetchCouncilMeetingsOfACity } from '@/fetchers/server/council-meeting'
import { fetchTopNCouncilTopics } from '@/fetchers/server/council-topic'
// components
import Open from '@/components/open'
import Dashboard from '@/components/council-dashboard'
import TopicSliders from '@/components/topic-sliders'
// utils
import { isValidCouncil } from '@/utils/council'
import { getImageLink } from '@/fetchers/utils'
// lodash
import { find } from 'lodash'
const _ = {
  find,
}

const testCards = [
  {
    title: '普發現金',
    billCount: 123,
    avatars: [
      'https://picsum.photos/id/1/200',
      'https://picsum.photos/id/2/200',
      'https://picsum.photos/id/3/200',
      'https://picsum.photos/id/4/200',
      'https://picsum.photos/id/5/200',
    ],
    councilorCount: 2,
  },
  {
    title: '金融監理與壽險風險因應處理1',
    billCount: 1234,
    avatars: [
      'https://picsum.photos/id/1/200',
      'https://picsum.photos/id/2/200',
    ],
    councilorCount: 10,
  },
  {
    title: '金融監理與壽險風險因應處理2',
    billCount: 1234,
    avatars: [
      'https://picsum.photos/id/1/200',
      'https://picsum.photos/id/2/200',
    ],
    councilorCount: 10,
  },
  {
    title: '金融監理與壽險風險因應處理3',
    billCount: 1234,
    avatars: [
      'https://picsum.photos/id/1/200',
      'https://picsum.photos/id/2/200',
    ],
    councilorCount: 10,
  },
  {
    title: '金融監理與壽險風險因應處理4',
    billCount: 1234,
    avatars: [
      'https://picsum.photos/id/1/200',
      'https://picsum.photos/id/2/200',
    ],
    councilorCount: 10,
  },
  {
    title: '金融監理與壽險風險因應處理5',
    billCount: 1234,
    avatars: [
      'https://picsum.photos/id/1/200',
      'https://picsum.photos/id/2/200',
    ],
    councilorCount: 10,
  },
  {
    title: '金融監理與壽險風險因應處理6',
    billCount: 1234,
    avatars: [
      'https://picsum.photos/id/1/200',
      'https://picsum.photos/id/2/200',
    ],
    councilorCount: 10,
  },
  {
    title: '金融監理與壽險風險因應處理7',
    billCount: 1234,
    avatars: [
      'https://picsum.photos/id/1/200',
      'https://picsum.photos/id/2/200',
    ],
    councilorCount: 10,
  },
]

export default async function CouncilDetailPage({
  params,
}: {
  params: Promise<{ districtSlug: string }>
}) {
  const { districtSlug } = await params

  // Validate the council districtSlug
  if (!isValidCouncil(districtSlug)) {
    notFound()
  }

  const meetings = await fetchCouncilMeetingsOfACity({ city: districtSlug })
  const latestMeetingId = meetings[0]?.id
  const [topics = [], parties] = await Promise.all([
    fetchTopNCouncilTopics({
      take: 10,
      skip: 0,
      councilMeetingId: latestMeetingId,
    }),
    fetchParty(),
  ])
  topics.forEach((topic) => {
    topic.councilors = topic.councilors
      ? topic.councilors.map(({ party, ...councilor }) => {
          const partyData = party
            ? _.find(parties, ({ id }) => String(id) === String(party))
            : undefined
          return {
            avatar: getImageLink(councilor),
            partyAvatar: partyData ? getImageLink(partyData) : '',
            party: partyData || party,
            ...councilor,
          }
        })
      : []
  })

  return (
    <div>
      <Open />
      <TopicSliders cards={testCards} />
      <Dashboard
        districtSlug={districtSlug}
        initialTopics={topics}
        parties={parties}
        meetings={meetings}
      />
    </div>
  )
}

export async function generateStaticParams() {
  return VALID_COUNCILS.map((districtSlug) => ({
    districtSlug,
  }))
}
