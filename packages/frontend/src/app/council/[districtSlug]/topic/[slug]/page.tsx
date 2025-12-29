export const dynamic = 'force-dynamic'
export const dynamicParams = true

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
// fetchers
import {
  fetchATopicName,
  fetchTopicBySlug,
} from '@/fetchers/server/council-topic'
import { fetchLatestMeetingTermOfACity } from '@/fetchers/server/council-meeting'
// utils
import { isValidCouncil } from '@/utils/council'
// components
import CouncilTopicPage from '@/components/council-topic'
// constants
import { InternalRoutes } from '@/constants/routes'
import { OG_IMAGE_URL } from '@/constants'
// @twreporter
import { CITY_LABEL } from '@twreporter/congress-dashboard-shared/lib/constants/city'

type Params = {
  slug: string
  districtSlug: string
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug, districtSlug } = await params

  if (!isValidCouncil(districtSlug)) {
    notFound()
  }

  const topicTitle = await fetchATopicName({ slug, districtSlug })
  if (!topicTitle) {
    notFound()
  }

  const councilorPageUrl = `https://lawmaker.twreporter.org${InternalRoutes.Council}/${districtSlug}${InternalRoutes.CouncilTopic}/${slug}`
  const metaTitle = `${CITY_LABEL[districtSlug]}議員｜${topicTitle} - 報導者觀測站`
  const metaDescription = `關注${topicTitle}的議員有哪些人？哪位民代最積極發聲？《報導者》用人工智慧技術分析議案，和你一起追蹤${topicTitle}議題在議會的討論熱度與議員關注面向。`

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: councilorPageUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: councilorPageUrl,
      type: 'article',
      images: OG_IMAGE_URL,
    },
  }
}

export default async function Page({ params }: { params: Promise<Params> }) {
  try {
    const { slug, districtSlug } = await params

    if (!isValidCouncil(districtSlug)) {
      notFound()
    }

    const [topic, term] = await Promise.all([
      fetchTopicBySlug({ slug, districtSlug }),
      fetchLatestMeetingTermOfACity({ city: districtSlug }),
    ])
    if (!topic || term === -1) {
      notFound()
    }
    const councilMeeting = {
      city: districtSlug,
      term,
    }

    return (
      <CouncilTopicPage topicData={topic} councilMeeting={councilMeeting} />
    )
  } catch (error) {
    console.error('Error fetching council topic data:', error)
    return <div>Failed to load council topic data. Please try again later.</div>
  }
}
