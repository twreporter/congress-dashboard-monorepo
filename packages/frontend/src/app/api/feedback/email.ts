import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
// type
import type { Feedback } from '@/app/api/feedback/type'
// constant
import { HttpStatus } from '@/app/api/_core/constants'

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

type ResponseData = {
  ok: boolean
  status: HttpStatus
  error?: Error
}

const createSESClient = () => {
  const region = process.env.AWS_SES_REGION

  if (!region) {
    return null
  }

  return new SESClient({ region })
}

const generateReplySubject = (): string => {
  if (releaseBranch === 'release') {
    return '《報導者觀測站》感謝您的回報！'
  }
  return '《報導者觀測站》「測試站」感謝您的回報！'
}

const generateReplyBody = (feedback: Feedback): string => {
  const name = feedback.username || '支持者'

  return `親愛的 ${name} 您好，

感謝您支持並使用《報導者觀測站》。
我們已收到您的回報，團隊成員會仔細瞭解您所提及的事項，
若後續有相關資訊需要與您確認，我們會透過此電子郵件再聯繫。
感謝您持續支持公共資料透明與媒體監督。

報導者數位產品部 敬上`
}

type SendReplyEmailType = (feedback: Feedback) => Promise<ResponseData>

const sendReplyEmail: SendReplyEmailType = async (data) => {
  if (!data.email) {
    return { ok: true, status: HttpStatus.OK }
  }

  const sesClient = createSESClient()
  const source = process.env.AWS_SES_FROM_EMAIL

    if (!sesClient || !source) {
    const missing: string[] = []
    if (!sesClient) {
      missing.push('AWS_SES_REGION')
    }
    if (!source) {
      missing.push('AWS_SES_FROM_EMAIL')
    }
    return {
      ok: false,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: new Error(
        `AWS SES configuration is missing: ${missing.join(', ')}`
      ),
    }
  }

  try {
    const command = new SendEmailCommand({
      Source: source,
      Destination: {
        ToAddresses: [data.email],
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: generateReplySubject(),
        },
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: generateReplyBody(data),
          },
        },
      },
    })

    await sesClient.send(command)

    return { ok: true, status: HttpStatus.OK }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return {
      ok: false,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    }
  }
}

export default sendReplyEmail
