const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const {
  transferCouncilSpeechModelToRecord,
  transferCouncilorModelToRecord,
} = require('../src/transfer')

const speech = {
  id: '1',
  slug: 'taipei-test-1',
  title: '會議',
  date: '2026-09-30',
  summaryFallback: '<p>測試摘要</p>\n內容',
  councilMeeting: { city: 'taipei', term: 14 },
  councilMember: [
    { councilor: { name: '甲' } },
    { councilor: { name: '乙' } },
    { councilor: { name: '甲' } },
  ],
}

test('speech records preserve all distinct speakers and stable identity', () => {
  const [record] = transferCouncilSpeechModelToRecord([speech])
  assert.deepEqual(record.councilorNames, ['甲', '乙'])
  assert.equal(record.objectID, 'taipei-test-1_taipei_14')
  assert.equal(record.date, '2026/09/30')
  assert.equal(record.dateTs, Date.parse('2026-09-30'))
  assert.equal(record.summary, '測試摘要內容')
  assert.equal('content' in record, false)
  assert.equal(
    transferCouncilSpeechModelToRecord([speech])[0].objectID,
    record.objectID
  )
})

test('optional relations and summary are not required; invalid identity is skipped', () => {
  const [record] = transferCouncilSpeechModelToRecord([
    { ...speech, summaryFallback: null, councilMember: [{ councilor: null }] },
  ])
  assert.deepEqual(record.councilorNames, [])
  assert.equal(record.summary, undefined)
  for (const invalid of [
    { slug: '' },
    { councilMeeting: null },
    { councilMeeting: { city: 'unknown', term: 14 } },
  ]) {
    assert.deepEqual(
      transferCouncilSpeechModelToRecord([{ ...speech, ...invalid }]),
      []
    )
  }
})

test('councilor uses speech date, never a newer bill date, and clears absent date', () => {
  const member = {
    id: 278,
    city: 'taipei',
    councilMeeting: { term: 14 },
    councilor: { name: '甲', slug: 'a' },
    latestSpeechDate: '2026-09-30',
    bill: [{ date: '2026-10-01' }],
  }
  const [record] = transferCouncilorModelToRecord([member])
  assert.equal(record.lastSpeechAt, '2026/09/30')
  assert.equal(record.objectID, '278_taipei_14')
  const [empty] = transferCouncilorModelToRecord([
    { ...member, latestSpeechDate: null },
  ])
  assert.equal(empty.lastSpeechAt, '')
  assert.equal(empty.lastSpeechAtTs, undefined)
  assert.equal('lastSpeechAtTs' in JSON.parse(JSON.stringify(empty)), false)
})

test('speech iterator pages meetings and resets speech cursors between meetings', async () => {
  process.env.GRAPHQL_ENDPOINT = 'https://example.invalid/graphql'
  process.env.HEADLESS_ACCOUNT_EMAIL = 'test'
  process.env.HEADLESS_ACCOUNT_PASSWORD = 'test'
  const axios = require('axios')
  const original = axios.post
  const calls = []
  let failQuery
  let noMeetings = false
  const nextSpeech = { ...speech, slug: 'taipei-next' }
  axios.post = async (_url, body) => {
    if (body.query.includes('mutation'))
      return {
        data: {
          data: {
            authenticateSystemUserWithPassword: { sessionToken: 'test' },
          },
        },
      }
    calls.push(body)
    if (failQuery && body.query.includes(failQuery))
      return { data: { errors: [{ message: 'test failure' }] } }
    if (body.query.includes('query CouncilSpeechMeetings')) {
      return {
        data: {
          data: {
            councilMeetings: noMeetings
              ? []
              : body.variables.skip === 0
              ? Array.from({ length: 100 }, (_, i) => ({ id: String(i + 1) }))
              : [{ id: '101' }],
          },
        },
      }
    }
    const meetingId = body.variables.where.councilMeeting.id.equals
    const speeches = body.variables.cursor
      ? []
      : meetingId === '1'
      ? [speech]
      : meetingId === '101'
      ? [nextSpeech]
      : []
    return {
      data: { data: { councilSpeeches: speeches } },
    }
  }
  try {
    const { councilSpeechIterator } = require('../src/graphql')
    const batches = []
    for await (const batch of councilSpeechIterator('taipei', 1))
      batches.push(batch)
    assert.deepEqual(batches.flat(), [speech, nextSpeech])
    assert.deepEqual(calls[0].variables.where, {
      city: { equals: 'taipei' },
    })
    const meetingCalls = calls.filter((c) =>
      c.query.includes('query CouncilSpeechMeetings')
    )
    assert.deepEqual(
      meetingCalls.map((c) => c.variables.skip),
      [0, 100]
    )
    const speechCalls = calls.filter(
      (c) => !c.query.includes('query CouncilSpeechMeetings')
    )
    assert.deepEqual(speechCalls[0].variables.where, {
      councilMeeting: { id: { equals: '1' } },
    })
    assert.deepEqual(speechCalls[1].variables.cursor, { slug: speech.slug })
    assert.equal(speechCalls[1].variables.skip, 1)
    for (const id of ['2', '101']) {
      const firstPage = speechCalls.find(
        (c) => c.variables.where.councilMeeting.id.equals === id
      )
      assert.equal(firstPage.variables.cursor, null)
      assert.equal(firstPage.variables.skip, 0)
    }
    for (const query of [
      'query CouncilSpeechMeetings',
      'query CouncilSpeeches(',
    ]) {
      failQuery = query
      await assert.rejects(async () => {
        for await (const _ of councilSpeechIterator('taipei')) {
        }
      }, /test failure/)
    }
    failQuery = undefined
    noMeetings = true
    calls.length = 0
    const empty = []
    for await (const batch of councilSpeechIterator('taipei')) empty.push(batch)
    assert.deepEqual(empty, [])
    assert.equal(calls.length, 1)
    noMeetings = false
    calls.length = 0
    // A partial speech page should finish that meeting without another request.
    for await (const _ of councilSpeechIterator('taipei', 10)) {
    }
    assert.equal(
      calls.filter((c) => c.variables.where.councilMeeting?.id.equals === '1')
        .length,
      1
    )
  } finally {
    axios.post = original
  }
})

test('councilor query requests the aggregate date instead of sorted speech records', async () => {
  process.env.GRAPHQL_ENDPOINT = 'https://example.invalid/graphql'
  process.env.HEADLESS_ACCOUNT_EMAIL = 'test'
  process.env.HEADLESS_ACCOUNT_PASSWORD = 'test'
  const axios = require('axios')
  const original = axios.post
  let query
  axios.post = async (_url, body) => {
    if (body.query.includes('mutation'))
      return {
        data: {
          data: {
            authenticateSystemUserWithPassword: { sessionToken: 'test' },
          },
        },
      }
    query = body.query
    return {
      data: {
        data: { councilMembers: [{ id: 67, latestSpeechDate: '2026-07-30' }] },
      },
    }
  }
  try {
    const { councilorIterator } = require('../src/graphql')
    const members = []
    for await (const batch of councilorIterator('taipei'))
      members.push(...batch)
    assert.equal(members[0].latestSpeechDate, '2026-07-30')
    assert.match(query, /\blatestSpeechDate\b/)
    assert.doesNotMatch(query, /\bspeech\s*\(/)
  } finally {
    axios.post = original
  }
})

test('speech uploads respect dry-run and use the dedicated index', async () => {
  const sdkPath = require.resolve('algoliasearch')
  const previous = require.cache[sdkPath]
  const writes = []
  process.env.ALGOLIA_APP_ID = 'test'
  process.env.ALGOLIA_WRITE_KEY = 'test'
  require.cache[sdkPath] = {
    id: sdkPath,
    filename: sdkPath,
    loaded: true,
    exports: {
      algoliasearch: () => ({
        saveObjects: async (request) => {
          writes.push(request)
        },
      }),
    },
  }
  const { dryrunState } = require('../src/state/dryrun')
  try {
    const { uploadCouncilSpeeches } = require('../src/algolia')
    const records = transferCouncilSpeechModelToRecord([speech])
    dryrunState.enable()
    await uploadCouncilSpeeches(records)
    assert.equal(writes.length, 0)
    dryrunState.disable()
    await uploadCouncilSpeeches(records)
    assert.deepEqual(writes, [
      { indexName: 'council-speech', objects: records },
    ])
  } finally {
    dryrunState.enable()
    if (previous) require.cache[sdkPath] = previous
    else delete require.cache[sdkPath]
    delete require.cache[require.resolve('../src/algolia')]
  }
})

test('CLI selects speech alone, combinations and all; dry-run remains enabled', () => {
  const setup = `
    const graphql = require.resolve('./src/graphql');
    const algolia = require.resolve('./src/algolia');
    const names = ['Councilor', 'CouncilTopic', 'CouncilBill', 'CouncilSpeech'];
    const gql = {};
    for (const name of names) gql[name[0].toLowerCase() + name.slice(1) + 'Iterator'] = async function* (city) { console.log('FETCH:' + name + ':' + city); yield [] };
    require.cache[graphql] = { id: graphql, filename: graphql, loaded: true, exports: gql };
    require.cache[algolia] = { id: algolia, filename: algolia, loaded: true, exports: {} };
    process.argv = ['node', 'src/index.ts', ...JSON.parse(process.env.TEST_ARGS)];
    require('./src/index');
    console.log('DRY:' + require('./src/state/dryrun').dryrunState.isEnabled());
  `
  for (const [flags, expected] of [
    [['--speech'], ['CouncilSpeech']],
    [
      ['--speech', '--councilor'],
      ['Councilor', 'CouncilSpeech'],
    ],
    [[], ['Councilor', 'CouncilTopic', 'CouncilSpeech', 'CouncilBill']],
  ]) {
    const env = { ...process.env }
    for (const key of Object.keys(env))
      if (key.startsWith('LAWMAKER_')) delete env[key]
    env.TEST_ARGS = JSON.stringify([
      'feed-algolia',
      'council',
      '--council-name',
      'taipei',
      ...flags,
    ])
    const result = spawnSync(
      process.execPath,
      ['-r', 'ts-node/register', '-e', setup],
      { env, encoding: 'utf8' }
    )
    assert.equal(result.status, 0, result.stderr)
    assert.deepEqual(
      [...result.stdout.matchAll(/FETCH:(\w+):taipei/g)].map((m) => m[1]),
      expected
    )
    assert.match(result.stdout, /DRY:true/)
  }
})
