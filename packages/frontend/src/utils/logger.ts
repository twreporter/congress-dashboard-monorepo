import pino from 'pino'
import { Logging } from '@google-cloud/logging'
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const logging = new Logging()
const log = logging.log(`${releaseBranch}-congress-dashboard-frontend`)

const isProduction = process.env.NODE_ENV === 'production'

const logger = pino({
  level: 'debug',
  formatters: {
    level: (label) => ({ severity: label.toUpperCase() }),
  },
  hooks: {
    logMethod(inputArgs, method) {
      const message = inputArgs[0]
      const metadata = inputArgs[1] || {}
      const entry = log.entry(
        { resource: { type: 'global' } },
        { message, ...metadata }
      )

      if (isProduction) {
        log.write(entry) // Send logs to Google Cloud in production
      }

      method.apply(this, inputArgs) // Always log to console
    },
  },
})

export default logger
