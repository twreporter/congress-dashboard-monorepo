import pino from 'pino'
import { createGcpLoggingPinoConfig } from '@google-cloud/pino-logging-gcp-config'

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const isProduction = process.env.NODE_ENV === 'production'

const logger = isProduction
  ? // Send logs to Google Cloud in production
    pino.pino(
      createGcpLoggingPinoConfig(
        {
          serviceContext: {
            service: `${releaseBranch}-congress-dashboard-frontend`,
          },
        },
        {
          level: 'debug',
        }
      )
    )
  : pino(
      pino.transport({
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
        level: 'debug',
      })
    )

export default logger
