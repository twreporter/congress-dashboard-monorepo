import { Metadata } from 'next'
import { notFound } from 'next/navigation'
// components
import TopicPage from '@/components/topic'
// fetcher
import { fetchTopic } from '@/fetchers/server/topic'
// utils
import { validateMeetingParams } from '@/utils/validate-meeting-params'
// constants
import { InternalRoutes } from '@/constants/routes'

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

  const { legislativeMeeting, legislativeMeetingSession } =
    await validateMeetingParams(meetingTerm, sessionTerm)

  const topic = await fetchTopic({
    slug,
    legislativeMeeting,
    legislativeMeetingSession,
  })

  if (!topic) {
    notFound()
  }

  const { title } = topic
  return {
    title: `議題｜${title} - 報導者觀測站`,
    description: '報導者議會透視版',
    alternates: {
      canonical: `https://lawmaker.twreporter.org${InternalRoutes.Topic}/${slug}`,
    },
    openGraph: {
      title: `議題｜${title} - 報導者觀測站`,
      url: `https://lawmaker.twreporter.org${InternalRoutes.Topic}/${slug}`,
      type: 'article',
    },
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string }>
}) {
  try {
    const { slug } = await params
    const { meetingTerm, sessionTerm } = await searchParams
    const { legislativeMeeting, legislativeMeetingSession } =
      await validateMeetingParams(meetingTerm, sessionTerm)
    const topic = await fetchTopic({
      slug,
      legislativeMeeting,
      legislativeMeetingSession,
    })

    if (!topic) {
      notFound()
    }

    return (
      <TopicPage
        topic={topic}
        currentMeetingTerm={legislativeMeeting}
        currentMeetingSession={legislativeMeetingSession}
      />
    )
  } catch (error) {
    console.error('Error fetching topic data:', error)
    return <div>Failed to load topic data. Please try again later.</div>
  }
}
