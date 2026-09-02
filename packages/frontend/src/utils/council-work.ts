export type WorkType = 'speech' | 'bill'

export type WorkRecord = {
  slug: string
  date: string
  title: string
  summaryFallback?: string
  type: WorkType
}

export type WorkGroup<T> = {
  period: string
  cards: T[]
}

export type WorkFilter = 'all' | WorkType

export const filterCouncilWork = <T extends { type: WorkType }>(
  work: T[],
  filter: WorkFilter
): T[] => (filter === 'all' ? work : work.filter(({ type }) => type === filter))

export const mergeCouncilWork = <T extends Omit<WorkRecord, 'type'>>(
  speeches: T[],
  bills: T[]
): WorkRecord[] =>
  [
    ...speeches.map((speech) => ({ ...speech, type: 'speech' as const })),
    ...bills.map((bill) => ({ ...bill, type: 'bill' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export const groupCouncilWorkByMonth = <T extends { date: string | Date }>(
  work: T[]
): WorkGroup<T>[] => {
  const groups = work.reduce<Record<string, T[]>>((result, record) => {
    const date = new Date(record.date)
    const period = `${date.getFullYear()}/${String(
      date.getMonth() + 1
    ).padStart(2, '0')}`
    result[period] = [...(result[period] || []), record]
    return result
  }, {})

  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([period, cards]) => ({ period, cards }))
}
