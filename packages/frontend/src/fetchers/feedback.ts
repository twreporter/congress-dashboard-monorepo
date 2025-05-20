'use client'

// type
import type { Feedback } from '@/app/api/feedback/type'

const feedback = async (feedbackData: Feedback) => {
  const url = process.env.NEXT_PUBLIC_FEEDBACK_API_URL as string
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedbackData),
  })

  if (!res.ok) {
    throw new Error(`Failed to submit feedback`)
  }

  return
}

export default feedback
