import { Metadata } from 'next'
import { notFound } from 'next/navigation'
// components
import TopicPage from '@/components/topic'
// fetcher
import { fetchTopic } from '@/fetchers/topic'

export const dynamicParams = true

// Validate meeting term and session term
const validateMeetingParams = (
  meetingTerm: string | undefined,
  sessionTerm: string | undefined
): { legislativeMeeting: number; legislativeMettingSession: number[] } => {
  // Default values if params are undefined
  const defaultMeeting = 11
  const defaultSession = [1, 2]

  let legislativeMeeting = defaultMeeting
  let legislativeMettingSession = defaultSession

  // Validate meeting term
  if (meetingTerm) {
    const parsedMeeting = parseInt(meetingTerm, 10)
    if (!isNaN(parsedMeeting) && parsedMeeting > 0) {
      legislativeMeeting = parsedMeeting
    }
  }

  // Validate session term
  if (sessionTerm) {
    try {
      const parsedSession = JSON.parse(sessionTerm)
      if (Array.isArray(parsedSession) && parsedSession.length > 0) {
        // Ensure all elements are valid numbers
        const validSession = parsedSession.filter(
          (item) => typeof item === 'number' && !isNaN(item) && item > 0
        )
        if (validSession.length > 0) {
          legislativeMettingSession = validSession
        }
      }
    } catch (error) {
      console.error('Error parsing sessionTerm:', error)
      // Use default session if parsing fails
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
    validateMeetingParams(meetingTerm, sessionTerm)

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
    validateMeetingParams(meetingTerm, sessionTerm)

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
