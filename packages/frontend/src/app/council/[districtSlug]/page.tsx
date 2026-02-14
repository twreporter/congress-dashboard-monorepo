export const dynamic = 'force-dynamic'
export const dynamicParams = true

import React from 'react'
import { notFound } from 'next/navigation'
// constants
import { VALID_COUNCILS } from '@/constants/council'
// fetcher
import { fetchParty } from '@/fetchers/server/party'
import { fetchCouncilMeetingsOfACity } from '@/fetchers/server/council-meeting'
import {
  fetchTopNCouncilTopics,
  fetchFeaturedCouncilTopics,
} from '@/fetchers/server/council-topic'
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
  const [topics = [], parties, featuredTopics] = await Promise.all([
    fetchTopNCouncilTopics({
      take: 10,
      skip: 0,
      councilMeetingId: latestMeetingId,
    }),
    fetchParty(),
    fetchFeaturedCouncilTopics({ city: districtSlug }),
  ])
  const partiesMap = parties
    ? new Map(parties.map((p) => [String(p.id), p]))
    : new Map()
  topics.forEach((topic) => {
    topic.councilors =
      topic.councilors?.map(({ party, ...councilor }) => {
        const partyData = party ? partiesMap.get(String(party)) : undefined
        return {
          avatar: getImageLink(councilor),
          partyAvatar: partyData ? getImageLink(partyData) : '',
          party: partyData || party,
          ...councilor,
        }
      }) || []
  })

  return (
    <div>
      <Open />
      <TopicSliders cards={featuredTopics} />
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
