import { Metadata } from 'next'
import { notFound } from 'next/navigation'
// fetcher
import {
  fetchLegislator,
  fetchLegislatorTopics,
} from '@/fetchers/server/legislator'
// components
import LegislatorPage from '@/components/legislator'
// utils
import { validateMeetingParams } from '@/utils/validate-meeting-params'

export const dynamicParams = true

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { meetingTerm, sessionTerm } = await searchParams

  const { legislativeMeeting } = await validateMeetingParams(
    meetingTerm,
    sessionTerm,
    false // Use first meeting as fallback for legislators
  )
  const data = await fetchLegislator({ slug, legislativeMeeting })
  if (!data) {
    notFound()
  }
  return {
    title: `委員 - ${data.legislator.name}`,
    description: '委員頁',
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string }>
}) {
  const { slug } = await params
  const { meetingTerm, sessionTerm } = await searchParams

  try {
    const { legislativeMeeting, legislativeMeetingSession } =
      await validateMeetingParams(meetingTerm, sessionTerm, false)

    const data = await fetchLegislator({ slug, legislativeMeeting })
    if (!data) {
      notFound()
    }

    const topicsData = await fetchLegislatorTopics({
      slug,
      legislativeMeetingTerm: legislativeMeeting,
      legislativeMeetingSessionTerms: legislativeMeetingSession,
    })

    return (
      <LegislatorPage
        legislatorData={data}
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
