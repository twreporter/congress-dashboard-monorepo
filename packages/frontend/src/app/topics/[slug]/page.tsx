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
  const { meetingTerm, sessionTerm } = await searchParams
  // TODO: validate meetingTerm and sessionTerm
  const legislativeMeeting = Number(meetingTerm)
  const legislativeMettingSession = JSON.parse(sessionTerm) as number[]
  const result = await fetchTopic({
    slug,
    legislativeMeeting,
    legislativeMettingSession,
  })
  const topic = result?.data?.topic
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
  // TODO: validate meetingTerm and sessionTerm
  const legislativeMeeting = Number(meetingTerm)
  const legislativeMettingSession = JSON.parse(sessionTerm) as number[]
  const result = await fetchTopic({
    slug,
    legislativeMeeting,
    legislativeMettingSession,
  })
  const topic = result?.data?.topic

  return (
    <TopicPage
      topic={topic}
      currentMeetingTerm={legislativeMeeting}
      currentMeetingSession={legislativeMettingSession}
    />
  )
}
