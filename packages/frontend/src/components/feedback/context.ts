import { createContext } from 'react'
// type
import type { FeedbackValue } from '@/components/feedback/type'

type FeedbackContextValue = {
  closeFeedback: () => void
  nextStep: () => void
  prevStep: () => void
  feedbackValue?: FeedbackValue
}

const defaultValue = {
  closeFeedback: () => {},
  nextStep: () => {},
  prevStep: () => {},
}

export const FeedbackContext = createContext<FeedbackContextValue>(defaultValue)
