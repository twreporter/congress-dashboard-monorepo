type GtmVar = string | number
function trackEvent(eventName: string, data: Record<string, GtmVar> = {}) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: eventName,
      page_path: window.location.pathname,
      ...data,
    })
  }
}

type SendFeedbackClickEvent = (name: string) => void
export const sendFeedbackClickEvent: SendFeedbackClickEvent = (name) => {
  trackEvent('feedback_click', {
    container_name: name,
  })
}
