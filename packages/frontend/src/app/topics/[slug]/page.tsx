import { Metadata } from 'next'
import { notFound } from 'next/navigation'
// components
import TopicPage from '@/components/topic'
// fetcher
import { fetchTopic } from '@/fetchers/topic'
import {
  fetchLegislativeMeeting,
  fetchLegislativeMeetingSession,
} from '@/fetchers/server/legislative-meeting'
// lodash
import find from 'lodash/find'
const _ = {
  find,
}

export const dynamicParams = true

const validateMeetingParams = async (
  meetingTerm: string | undefined,
  sessionTerm: string | undefined
) => {
  const legislativeMeetings = await fetchLegislativeMeeting()
  let legislativeMeeting =
    legislativeMeetings[legislativeMeetings.length - 1].term
  if (meetingTerm) {
    const parsedMeeting = parseInt(meetingTerm, 10)
    if (
      !isNaN(parsedMeeting) &&
      _.find(legislativeMeetings, ({ term }) => term === parsedMeeting)
    ) {
      legislativeMeeting = parsedMeeting
    }
  }
  const legislativeMeetingSessions = await fetchLegislativeMeetingSession(
    String(legislativeMeeting)
  )
  let legislativeMettingSession = legislativeMeetingSessions.map(
    (session) => session.term
  )
  if (sessionTerm) {
    try {
      const parsedSession = JSON.parse(sessionTerm)
      if (Array.isArray(parsedSession) && parsedSession.length > 0) {
        const validSessions = parsedSession.filter(
          (item) =>
            typeof item === 'number' &&
            !isNaN(item) &&
            _.find(legislativeMeetingSessions, ({ term }) => term === item)
        )

        if (validSessions.length > 0) {
          legislativeMettingSession = validSessions
        }
      }
    } catch (error) {
      console.error('Error parsing sessionTerm:', error)
    }
  }
  return { legislativeMeeting, legislativeMettingSession }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { meetingTerm, sessionTerm } = await searchParams

  const { legislativeMeeting, legislativeMettingSession } =
    await validateMeetingParams(meetingTerm, sessionTerm)

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
  const { meetingTerm, sessionTerm } = await searchParams

  const { legislativeMeeting, legislativeMettingSession } =
    await validateMeetingParams(meetingTerm, sessionTerm)

  try {
    const topic = await fetchTopic({
      slug,
      legislativeMeeting,
      legislativeMettingSession,
    })

    if (!topic) {
      notFound()
    }

    return (
      <TopicPage
        topic={topic}
        currentMeetingTerm={legislativeMeeting}
        currentMeetingSession={legislativeMettingSession}
      />
    )
  } catch (error) {
    console.error('Error fetching topic data:', error)
    return <div>Failed to load topic data. Please try again later.</div>
  }
}
