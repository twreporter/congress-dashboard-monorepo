import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  filterCouncilWork,
  groupCouncilWorkByMonth,
  mergeCouncilWork,
} from './council-work.ts'

const speech = {
  slug: 'speech-1',
  date: '2024-07-01',
  title: 'Speech',
  summaryFallback: 'Speech summary',
}
const bill = {
  slug: 'bill-1',
  date: '2024-06-30',
  title: 'Bill',
  summaryFallback: 'Bill summary',
}

describe('mergeCouncilWork', () => {
  it('labels speech and bill records and sorts them newest first', () => {
    assert.deepEqual(mergeCouncilWork([speech], [bill]), [
      { ...speech, type: 'speech' },
      { ...bill, type: 'bill' },
    ])
  })
})

describe('groupCouncilWorkByMonth', () => {
  it('groups work by descending YYYY/MM periods', () => {
    const work = mergeCouncilWork(
      [speech, { ...speech, slug: 'speech-2', date: '2024-06-15' }],
      [bill]
    )
    const groups = groupCouncilWorkByMonth(work)

    assert.deepEqual(
      groups.map(({ period, cards }) => ({
        period,
        slugs: cards.map(({ slug }) => slug),
      })),
      [
        { period: '2024/07', slugs: ['speech-1'] },
        { period: '2024/06', slugs: ['bill-1', 'speech-2'] },
      ]
    )
  })
})

describe('filterCouncilWork', () => {
  const work = mergeCouncilWork([speech], [bill])

  it('keeps both work types when all is selected', () => {
    assert.deepEqual(filterCouncilWork(work, 'all'), work)
  })

  it('keeps only speeches or bills for their respective filters', () => {
    assert.deepEqual(
      filterCouncilWork(work, 'speech').map(({ slug }) => slug),
      ['speech-1']
    )
    assert.deepEqual(
      filterCouncilWork(work, 'bill').map(({ slug }) => slug),
      ['bill-1']
    )
  })
})
