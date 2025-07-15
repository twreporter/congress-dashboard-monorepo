// constants
import { FEEDBACK_ID } from '@/constants'
// utils
import { sendFeedbackClickEvent } from '@/utils/gtm'

const getFeedback = () => {
  const feedbackComponent = document.getElementById(FEEDBACK_ID)
  if (!feedbackComponent) {
    throw `cannot find snack bar component with id: ${FEEDBACK_ID}`
  }
  return feedbackComponent
}

export const openFeedback = (name?: string) => {
  const feedbackBox = getFeedback()
  feedbackBox.style.display = 'block'
  sendFeedbackClickEvent(name || 'feedback')
}

export const closeFeedback = () => {
  const feedbackBox = getFeedback()
  feedbackBox.style.display = 'none'
}
