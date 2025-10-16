import env from '../environment-variables'

type LogSeverity =
  | 'DEBUG'
  | 'INFO'
  | 'NOTICE'
  | 'WARNING'
  | 'ERROR'
  | 'CRITICAL'
  | 'ALERT'
  | 'EMERGENCY'

type BaseLogFields = {
  severity?: LogSeverity
  message: string
  // Additional fields to be merged at root level for GCP structured logging
  [key: string]: unknown
}

// Minimal, dependency-free structured logger that prints one JSON object per line.
// Compatible with Google Cloud Logging structured log ingestion.
function log(base: BaseLogFields) {
  const { severity = 'INFO', message, ...rest } = base

  const payload = {
    severity,
    message,
    timestamp: new Date().toISOString(),
    // Attach basic runtime context for easier filtering
    context: {
      service: 'cms',
      env: env.nodeEnv,
      releaseBranch: env.releaseBranch,
    },
    ...rest,
  }

  // Write to stdout; GCP interprets JSON per line
  // Use console.log to avoid buffering surprises in serverless/container logs
  // Ensure single-line JSON
  try {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(payload))
  } catch (e) {
    // Fallback: best-effort string output
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify({
        severity: 'ERROR',
        message: 'Failed to stringify log payload',
        error: String(e),
      })
    )
  }
}

export const logger = {
  debug(message: string, fields: Record<string, unknown> = {}) {
    log({ severity: 'DEBUG', message, ...fields })
  },
  info(message: string, fields: Record<string, unknown> = {}) {
    log({ severity: 'INFO', message, ...fields })
  },
  warn(message: string, fields: Record<string, unknown> = {}) {
    log({ severity: 'WARNING', message, ...fields })
  },
  error(message: string, fields: Record<string, unknown> = {}) {
    log({ severity: 'ERROR', message, ...fields })
  },
}

export type { LogSeverity }
