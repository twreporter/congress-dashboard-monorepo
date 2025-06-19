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
// constants
import { OG_IMAGE_URL } from '@/constants'

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
    description: `關注${title}的立委有哪些人？哪位民代最積極發言？《報導者》用人工智慧技術分析立法院公報，和你一起追蹤${title}議題在國會的討論熱度與立委關注面向。`,
    alternates: {
      canonical: `https://lawmaker.twreporter.org${InternalRoutes.Topic}/${slug}`,
    },
    openGraph: {
      title: `議題｜${title} - 報導者觀測站`,
      description: `關注${title}的立委有哪些人？哪位民代最積極發言？《報導者》用人工智慧技術分析立法院公報，和你一起追蹤${title}議題在國會的討論熱度與立委關注面向。`,
      url: `https://lawmaker.twreporter.org${InternalRoutes.Topic}/${slug}`,
      type: 'article',
      images: OG_IMAGE_URL,
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
