import type { Hit } from 'instantsearch.js'
import type { HitAttributeSnippetResult } from 'instantsearch.js'
import { useSearchBox } from 'react-instantsearch'
import useWindowWidth from '@/hooks/use-window-width'
import { generateSnippetForDevices } from './utils'

/**
 * Generates a custom snippet for a hit based on query and viewport width
 * Overrides Algolia's global snippet settings for responsive truncation
 *
 * @param hit - The Algolia hit object
 * @param attribute - The attribute name to generate snippet for (default: 'desc')
 * @returns Hit object with customized snippet in _snippetResult
 */
export function useCustomSnippet<T extends Hit<Record<string, unknown>>>(
  hit: T,
  attribute: string = 'desc'
): T {
  const { query } = useSearchBox()
  const windowWidth = useWindowWidth()

  const matchedTextArr = query.split(' ')
  const attributeValue = hit[attribute]
  const content = typeof attributeValue === 'string' ? attributeValue : ''
  const snippet = generateSnippetForDevices(
    content,
    matchedTextArr,
    windowWidth
  )

  return {
    ...hit,
    _snippetResult: {
      ...(hit._snippetResult ?? {}),
      [attribute]: {
        value: snippet,
        matchLevel: (
          hit._snippetResult?.[attribute] as HitAttributeSnippetResult
        )?.matchLevel,
      } as HitAttributeSnippetResult,
    },
  }
}
