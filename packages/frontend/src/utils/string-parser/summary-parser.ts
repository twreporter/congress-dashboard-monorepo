// summary will be like this:
// "<ul><li>this is a long sentence</li><li>this is a long sentence</li></ul>" or "this is a long sentence"
const summaryParser = (summary: string): string | string[] => {
  if (/<ul>[\s\S]*<\/ul>/i.test(summary)) {
    const items = Array.from(summary.matchAll(/<li>([\s\S]*?)<\/li>/gi), (m) =>
      m[1].trim()
    )
    return items
  }
  return summary
}

export default summaryParser
