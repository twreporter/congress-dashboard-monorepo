import { Metadata } from 'next'
import { notFound } from 'next/navigation'
// fetcher
import {
  fetchLegislator,
  fetchLegislatorTopics,
} from '@/fetchers/server/legislator'
import {
  fetchLegislativeMeeting,
  fetchLegislativeMeetingSession,
} from '@/fetchers/server/legislative-meeting'
// components
import LegislatorPage from '@/components/legislator'
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
  console.log('legislativeMeetings: ', legislativeMeetings)
  let legislativeMeeting = legislativeMeetings[0].term
  console.log('legislativeMeeting: ', legislativeMeeting)
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
  let legislativeMeetingSession = legislativeMeetingSessions.map(
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
          legislativeMeetingSession = validSessions
        }
      }
    } catch (error) {
      console.error('Error parsing sessionTerm:', error)
    }
  }
  return { legislativeMeeting, legislativeMeetingSession }
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

  const { legislativeMeeting } = await validateMeetingParams(
    meetingTerm,
    sessionTerm
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
      await validateMeetingParams(meetingTerm, sessionTerm)

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
