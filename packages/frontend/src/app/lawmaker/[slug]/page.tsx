// use ISR cache 2hr
export const dynamic = 'auto'
export const revalidate = 7200

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
// fetchers
import {
  checkLegislatorExist,
  fetchLegislator,
  fetchLegislatorTopics,
  getLegislatorMeetingTerms,
} from '@/fetchers/server/legislator'
// components
import LegislatorPage from '@/components/legislator'
// utils
import { validateMeetingParams } from '@/utils/validate-meeting-params'
// constants
import { InternalRoutes } from '@/constants/routes'
import { OG_IMAGE_URL } from '@/constants'

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ meetingTerm?: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { meetingTerm } = await searchParams

  const isLegislatorExist = await checkLegislatorExist({ slug })
  if (!isLegislatorExist) {
    notFound()
  }
  const meetingTerms = await getLegislatorMeetingTerms({ slug })
  const chosenMeetingTerm =
    meetingTerm && meetingTerms.includes(meetingTerm)
      ? meetingTerm
      : meetingTerms[0]

  const data = await fetchLegislator({
    slug,
    legislativeMeeting: Number(chosenMeetingTerm),
  })

  return {
    title: `立委｜${data?.legislator.name} - 報導者觀測站`,
    description: `立委${data?.legislator.name}關心哪些議題、質詢哪些部會官員？《報導者》用人工智慧技術分析立法院公報，帶你快速掌握${data?.legislator.name}不同時段的問政重點與發言紀錄。`,
    alternates: {
      canonical: `https://lawmaker.twreporter.org${InternalRoutes.Legislator}/${slug}`,
    },
    openGraph: {
      title: `立委｜${data?.legislator.name} - 報導者觀測站`,
      description: `立委${data?.legislator.name}關心哪些議題、質詢哪些部會官員？《報導者》用人工智慧技術分析立法院公報，帶你快速掌握${data?.legislator.name}不同時段的問政重點與發言紀錄。`,
      url: `https://lawmaker.twreporter.org${InternalRoutes.Legislator}/${slug}`,
      type: 'profile',
      images: OG_IMAGE_URL,
    },
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ meetingTerm?: string; sessionTerm?: string }>
}) {
  try {
    const { slug } = await params
    const { meetingTerm, sessionTerm } = await searchParams
    const meetingTerms = await getLegislatorMeetingTerms({ slug })

    const chosenMeetingTerm =
      meetingTerm && meetingTerms.includes(meetingTerm)
        ? meetingTerm
        : meetingTerms[0]

    const { legislativeMeeting, legislativeMeetingSession } =
      await validateMeetingParams(chosenMeetingTerm, sessionTerm)

    const [legislatorData, topicsData] = await Promise.all([
      fetchLegislator({ slug, legislativeMeeting }),
      fetchLegislatorTopics({
        slug,
        legislativeMeetingTerm: legislativeMeeting,
        legislativeMeetingSessionTerms: legislativeMeetingSession,
      }),
    ])

    if (!legislatorData) notFound()

    return (
      <LegislatorPage
        legislatorData={legislatorData}
        topicsData={topicsData}
        currentMeetingTerm={legislativeMeeting}
        currentMeetingSession={legislativeMeetingSession}
      />
    )
  } catch (error) {
    console.error('Error fetching legislator data:', error)
    return <div>Failed to load legislator data. Please try again later.</div>
  }
}
