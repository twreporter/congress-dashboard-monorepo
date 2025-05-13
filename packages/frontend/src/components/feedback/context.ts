import { createContext } from 'react'

type FeedbackContextValue = {
  closeFeedback: () => void
  nextStep: () => void
  prevStep: () => void
}

const defaultValue = {
  closeFeedback: () => {},
  nextStep: () => {},
  prevStep: () => {},
}

export const FeedbackContext = createContext<FeedbackContextValue>(defaultValue)
