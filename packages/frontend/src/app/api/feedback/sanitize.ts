const MAX_USERNAME_LENGTH = 50

/**
 * Sanitize the username field to prevent injection attacks
 * when it is included in outgoing emails or Slack messages.
 *
 * - Strips HTML tags
 * - Removes potentially dangerous characters (< > & " ')
 * - Trims whitespace
 * - Limits length to MAX_USERNAME_LENGTH characters
 */
export function sanitizeUsername(username?: string): string {
  if (!username) return ''

  return username
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/[<>&"']/g, '') // remove residual dangerous characters
    .trim()
    .slice(0, MAX_USERNAME_LENGTH)
}
