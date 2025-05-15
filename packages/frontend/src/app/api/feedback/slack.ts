// type
import type { Feedback } from '@/app/api/feedback/type'
// util
import { generatePayloadFromFeedback } from '@/app/api/feedback/utils'
// constant
import { HttpStatus } from '@/app/api/feedback/constant'

type ResponseData = {
  ok: boolean
  status: HttpStatus
  error?: Error
}

type SlackFuncType = (feedback: Feedback) => Promise<ResponseData>
const slack: SlackFuncType = async (data) => {
  const webhookUrl = process.env.FEEDBACK_SLACK_WEBHOOK_URL
  if (!webhookUrl) {
    return {
      ok: false,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: new Error(`invalid webhook config: ${webhookUrl}`),
    }
  }

  const payload = generatePayloadFromFeedback(data)
  const slackRes = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: payload }),
  })

  if (!slackRes.ok) {
    const text = await slackRes.text()
    return {
      ok: false,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: new Error(text),
    }
  }

  return { ok: true, status: HttpStatus.OK }
}

export default slack
