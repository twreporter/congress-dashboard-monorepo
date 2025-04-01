import { Metadata } from 'next'
import { notFound } from 'next/navigation'
// components
import TopicPage from '@/components/topic'
// fetcher
import { fetchTopic } from '@/fetchers/topic'

export const dynamicParams = true

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { meetingTerm = 11, sessionTerm = '[1, 2, 3, 4]' } = await searchParams
  // TODO: validate meetingTerm and sessionTerm
  const legislativeMeeting = Number(meetingTerm)
  const legislativeMettingSession = JSON.parse(sessionTerm) as number[]
  const topic = await fetchTopic({
    slug,
    legislativeMeeting,
    legislativeMettingSession,
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
  const { meetingTerm = 11, sessionTerm = '[1, 2, 3, 4]' } = await searchParams
  // TODO: validate meetingTerm and sessionTerm
  const legislativeMeeting = Number(meetingTerm)
  const legislativeMettingSession = JSON.parse(sessionTerm) as number[]
  const topic = await fetchTopic({
    slug,
    legislativeMeeting,
    legislativeMettingSession,
  })

  return (
    <TopicPage
      topic={topic}
      currentMeetingTerm={legislativeMeeting}
      currentMeetingSession={legislativeMettingSession}
    />
  )
}
