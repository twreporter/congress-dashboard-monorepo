const { test } = require('node:test')
const assert = require('node:assert/strict')
const { transferCouncilBillModelToRecord } = require('../src/transfer')

const bill = {
  id: '1',
  slug: 'taipei-bill-1',
  title: '測試議案',
  date: '2026-09-30',
  councilMeeting: { city: 'taipei', term: 14 },
  councilMember: [
    { councilor: { name: '甲' } },
    { councilor: { name: '乙' } },
    { councilor: { name: '甲' } },
    { councilor: null },
    { councilor: { name: '' } },
  ],
}

test('bill records include every named proposer while preserving display and identity', () => {
  const [record] = transferCouncilBillModelToRecord([bill])
  assert.deepEqual(record.councilorNames, ['甲', '乙'])
  assert.equal(record.councilor, '甲')
  assert.equal(record.councilorCount, 5)
  assert.equal(record.objectID, 'taipei-bill-1_taipei_14')
})

test('missing proposer names do not exclude bills or later named proposers', () => {
  for (const councilMember of [[], [{ councilor: null }]]) {
    const [record] = transferCouncilBillModelToRecord([
      { ...bill, councilMember },
    ])
    assert.deepEqual(record.councilorNames, [])
    assert.equal(record.councilor, '')
  }
  const [record] = transferCouncilBillModelToRecord([
    {
      ...bill,
      councilMember: [{ councilor: null }, { councilor: { name: '乙' } }],
    },
  ])
  assert.deepEqual(record.councilorNames, ['乙'])
})
