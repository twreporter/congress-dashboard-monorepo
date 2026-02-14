export type ListName = 'speech' | 'bill'

const parseRule = {
  specificH2: /^##\s+說明\s*\n?/gm, // remove `## 說明` whole line
  H2: /^##\s+/gm, // remove only ## for rest H2
  list: /<\/?(ul|ol|li)[^>]*>/g,
  lineBreak: /\\n|\r?\n/g,
} as const

const ruleSet: Record<ListName, RegExp[]> = {
  speech: [parseRule.list],
  bill: [
    parseRule.specificH2,
    parseRule.H2,
    parseRule.list,
    parseRule.lineBreak,
  ],
}

function toPlainTextSummary(
  listname: ListName,
  input: unknown,
  limit?: number
): string | null {
  if (input === null) {
    return null
  }
  const raw =
    typeof input === 'string'
      ? input
      : typeof input === 'object'
      ? JSON.stringify(input)
      : String(input)

  const parseRules = ruleSet[listname]
  const summary = parseRules.reduce(
    (acc, rule) =>
      rule === parseRule.lineBreak
        ? acc.replace(rule, ' ')
        : acc.replace(rule, ''),
    raw
  )

  return limit && summary.length > limit ? summary.slice(0, limit) : summary
}

export default toPlainTextSummary
