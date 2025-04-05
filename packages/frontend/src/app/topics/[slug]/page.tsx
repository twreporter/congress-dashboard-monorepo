import { Metadata } from 'next'
import { notFound } from 'next/navigation'
// components
import TopicPage from '@/components/topic'
// fetcher
import { fetchTopic } from '@/fetchers/topic'
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

  const { legislativeMeeting, legislativeMeetingSession } =
    await validateMeetingParams(meetingTerm, sessionTerm)

  const topic = await fetchTopic({
    slug,
    legislativeMeeting,
    legislativeMettingSession: legislativeMeetingSession,
  })

  if (!topic) {
    notFound()
  }

  const { title, speechesCount } = topic
  return {
    title: `議題 - ${title}`,
    description: `議題頁, ${speechesCount} 筆相關發言摘要`,
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

  const { legislativeMeeting, legislativeMeetingSession } =
    await validateMeetingParams(meetingTerm, sessionTerm)

  try {
    const topic = await fetchTopic({
      slug,
      legislativeMeeting,
      legislativeMettingSession: legislativeMeetingSession,
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
