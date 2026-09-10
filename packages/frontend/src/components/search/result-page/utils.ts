import { DEFAULT_SCREEN } from '@twreporter/core/lib/utils/media-query'

/**
 * Builds a URL query parameter string for meeting term
 * @param meetingTerm - Optional meeting term number
 * @returns Query string like "?meetingTerm=10" or empty string
 */
export function buildMeetingTermParam(meetingTerm?: number): string {
  return meetingTerm ? `?meetingTerm=${meetingTerm}` : ''
}

/**
 * Generates a snippet of the input text centered around the first matched keyword.
 * Adds <mark> tags around all matched words, and truncates to maxLength with ellipses if needed.
 *
 * ⚠️ Warning: This function is designed **only for Chinese text**. It assumes words are not separated by spaces,
 * and may not work correctly with other languages.
 *
 * For example:
 * ```ts
 * const text = '這隻敏捷的棕色狐狸跳過了一隻懶惰的狗。'
 * const matchedTextArr = ['狐狸','狗']
 * const maxLength = 15
 * generateSnippet(text, matchedTextArr, maxLength);
 * // return "...的棕色<mark>狐狸</mark>跳過了一隻懶惰的<mark>狗</mark>。"
 * ```
 *
 * If no matched word is found, it simply returns the first `maxLength` characters:
 * ```ts
 * const text = '這隻敏捷的棕色狐狸跳過了一隻懶惰的狗。'
 * const matchedTextArr = ['老虎']
 * const maxLength = 15
 * generateSnippet(text, matchedTextArr, maxLength);
 * // return "這隻敏捷的棕色狐狸跳過了一隻懶..."
 * ```
 *
 * @param text - The full original text.
 * @param matchedTextArr - An array of keywords to highlight.
 * @param maxLength - Maximum number of characters to include in the snippet.
 * @returns Highlighted, truncated snippet string.
 */
export function generateSnippet(
  text: string,
  matchedTextArr: string[],
  maxLength: number
): string {
  // Handle invalid input
  if (
    typeof text !== 'string' ||
    text === '' ||
    typeof maxLength !== 'number' ||
    maxLength <= 0 ||
    !Array.isArray(matchedTextArr)
  ) {
    return text
  }

  const ellipsis = '...'
  let snippet = text.slice(0, maxLength)
  let isTruncated = false

  // Append ellipsis if original text is longer than maxLength
  if (text.length > maxLength) {
    snippet += ellipsis
  }

  // Try to find the first keyword to center snippet around
  for (const matchedText of matchedTextArr) {
    if (!matchedText) {
      continue
    }

    const matchIndex = text.indexOf(matchedText)
    if (matchIndex === -1) {
      continue
    }

    // Only truncate once based on the first matched keyword
    if (!isTruncated) {
      // Reserve ellipsis width when computing slice bounds so visible text
      // remains close to `maxLength` after we prepend/append "...".
      const buffer = ellipsis.length
      let startIdx = 0
      let endIdx = text.length

      if (matchIndex <= text.length / 2) {
        // Prefer showing content from the beginning
        startIdx = Math.max(matchIndex - buffer, 0)

        // Include `buffer` so appending trailing "..." does not reduce the
        // intended visible snippet window (`maxLength`).
        endIdx = Math.min(startIdx + maxLength + buffer, text.length)
      } else {
        // Latter-half match: keep the matched keyword within the snippet window
        endIdx = Math.min(matchIndex + maxLength + buffer, text.length)

        // Include `buffer` so prepending leading "..." does not reduce the
        // intended visible snippet window (`maxLength`).
        startIdx = Math.max(endIdx - maxLength - buffer, 0)
      }

      snippet = text.slice(startIdx, endIdx)

      // Add ellipses as needed
      if (startIdx > 0) {
        snippet = ellipsis + snippet
      }
      if (endIdx < text.length) {
        snippet += ellipsis
      }

      isTruncated = true
    }

    // Highlight all occurrences of the matched word
    snippet = snippet.replaceAll(matchedText, `<mark>${matchedText}</mark>`)
  }

  return snippet
}

export function generateSnippetForDevices(
  text: string,
  matchedTextArr: string[],
  windowWidth: number
) {
  let maxLength = 84 // for desktop above

  switch (true) {
    case windowWidth >= DEFAULT_SCREEN.tablet.minWidth &&
      windowWidth < DEFAULT_SCREEN.desktop.minWidth: {
      maxLength = 82 // for tablet only
      break
    }
    case windowWidth < DEFAULT_SCREEN.tablet.minWidth: {
      maxLength = 34 // for tablet below
      break
    }
  }
  return generateSnippet(text, matchedTextArr, maxLength)
}
