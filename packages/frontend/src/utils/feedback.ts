// constants
import { FEEDBACK_ID } from '@/constants'

const getFeedback = () => {
  const feedbackComponent = document.getElementById(FEEDBACK_ID)
  if (!feedbackComponent) {
    throw `cannot find snack bar component with id: ${FEEDBACK_ID}`
  }
  return feedbackComponent
}

export const openFeedback = () => {
  const feedbackBox = getFeedback()
  feedbackBox.style.display = 'block'
}

export const closeFeedback = () => {
  const feedbackBox = getFeedback()
  feedbackBox.style.display = 'none'
}
