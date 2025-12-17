import type { ReactNode } from 'react'
import { H2 } from '@twreporter/react-components/lib/text/headline'

type ListType = 'ul' | 'ol'

const supportRegex = {
  lineBreak: /\\n|\r?\n/, // support both `\n` & `\\n` & `\r\n` as line break
  bold: /\*\*(.+?)\*\*/g,
  h2: /^##\s+/,
  ul: /^-\s+/,
  ol: /^\d+\.\s+/,
}

/*
 *  parseInline
 *    parse inline markdown syntax, only support bold in this version
 *    - bold: **bold text**
 */
const parseInline = (text: string): ReactNode => {
  if (!text.includes('**')) return text

  const parts = text.split(supportRegex.bold)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

/*
 *  parseMarkdownToReact
 *    parse markdown string to react nodes, currently supports:
 *    - ## heading  → <h2>heading</h2>
 *    - - item      → <ul><li>…</li></ul>
 *    - 1. item     → <ol><li>…</li></ol>
 *    - **bold**    → <strong>bold</strong>
 *    - plain text  → <p>
 */
function parseMarkdownToReact(md: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let listItems: string[] = []
  let listType: ListType | null = null

  const flushList = () => {
    if (!listType || listItems.length === 0) return
    const items = listItems.map((item, idx) => (
      <li key={`list-item-${idx}`}>{parseInline(item)}</li>
    ))
    nodes.push(
      listType === 'ul' ? (
        <ul key={`ul-${nodes.length}`}>{items}</ul>
      ) : (
        <ol key={`ol-${nodes.length}`}>{items}</ol>
      )
    )
    listItems = []
    listType = null
  }

  const lines = md.split(supportRegex.lineBreak)
  for (const line of lines) {
    // empty line ends list
    if (line.trim() === '') {
      flushList()
      continue
    }

    // heading
    if (supportRegex.h2.test(line)) {
      flushList()
      const text = line.replace(supportRegex.h2, '')
      nodes.push(<H2 key={`h2-${nodes.length}`} text={text}></H2>)
      continue
    }

    // ul
    if (supportRegex.ul.test(line)) {
      const itemText = line.replace(supportRegex.ul, '')
      if (listType !== 'ul') {
        flushList()
        listType = 'ul'
      }
      listItems.push(itemText)
      continue
    }

    // ol
    if (supportRegex.ol.test(line)) {
      const itemText = line.replace(supportRegex.ol, '')

      if (listType !== 'ol') {
        flushList()
        listType = 'ol'
      }

      listItems.push(itemText)
      continue
    }

    flushList()
    nodes.push(<p key={`p-${nodes.length}`}>{parseInline(line)}</p>)
  }

  flushList()
  return nodes
}

export default parseMarkdownToReact
