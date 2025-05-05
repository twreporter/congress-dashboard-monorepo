import {
  fetchLegislativeMeeting,
  fetchLegislativeMeetingSession,
} from '@/fetchers/server/legislative-meeting'
import find from 'lodash/find'

const _ = {
  find,
}

export async function validateMeetingParams(
  meetingTerm: string | undefined,
  sessionTerm: string | undefined,
  useLatestAsFallback = true
) {
  const legislativeMeetings = await fetchLegislativeMeeting()

  // Set default meeting term (either first or last, depending on parameter)
  let legislativeMeeting = useLatestAsFallback
    ? legislativeMeetings[0].term
    : legislativeMeetings[legislativeMeetings.length - 1].term

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

  return {
    legislativeMeeting,
    legislativeMeetingSession,
  }
}
