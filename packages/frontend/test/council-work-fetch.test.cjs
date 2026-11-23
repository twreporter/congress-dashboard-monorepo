const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

function load(fetcher) {
  function loadFile(filename) {
    const { outputText } = ts.transpileModule(
      fs.readFileSync(filename, 'utf8'),
      {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          esModuleInterop: true,
        },
      }
    )
    const module = { exports: {} }
    new Function('require', 'module', 'exports', outputText)(
      (name) =>
        name === '@/app/api/_graphql/keystone'
          ? { __esModule: true, default: fetcher }
          : name.startsWith('@/')
          ? loadFile(path.resolve(__dirname, '../src', name.slice(2) + '.ts'))
          : require(name),
      module,
      module.exports
    )
    return module.exports
  }
  return loadFile(
    path.resolve(
      __dirname,
      '../src/app/api/councilor/[slug]/topic/[topicSlug]/work/query.ts'
    )
  ).default
}
const params = {
  councilorSlug: 'member',
  topicSlug: 'topic',
  councilMeetingId: 4,
}
const items = (count, prefix) =>
  Array.from({ length: count }, (_, i) => ({
    slug: `${prefix}-${i}`,
    date: '2026-11-01',
    title: 'Title',
  }))

test('collects all pages when bills outnumber speeches without truncating counts', async () => {
  const calls = []
  const pages = [
    { speeches: items(3, 's'), bills: items(100, 'b') },
    { speeches: [], bills: items(1, 'last') },
  ]
  const fetch = load(async (body) => {
    calls.push(JSON.parse(body).variables)
    return { data: { councilWorkPage: pages.shift() } }
  })
  const result = await fetch(params)
  assert.equal(result.speechCount, 3)
  assert.equal(result.billCount, 101)
  assert.equal(result.work.length, 104)
  assert.deepEqual(calls, [
    { ...params, take: 100, skip: 0 },
    { ...params, take: 100, skip: 100 },
  ])
})

test('full speech page triggers another read even when no bills exist', async () => {
  let calls = 0
  const fetch = load(async () => ({
    data: {
      councilWorkPage: {
        speeches: calls++ === 0 ? items(100, 's') : [],
        bills: [],
      },
    },
  }))
  assert.equal((await fetch(params)).speechCount, 100)
  assert.equal(calls, 2)
})

test('empty work stops after the first page', async () => {
  let calls = 0
  const fetch = load(async () => {
    calls++
    return { data: { councilWorkPage: { speeches: [], bills: [] } } }
  })
  assert.deepEqual(await fetch(params), {
    work: [],
    speechCount: 0,
    billCount: 0,
  })
  assert.equal(calls, 1)
})

test('GraphQL errors and missing pages never become successful empty results', async () => {
  for (const response of [
    { errors: [{ message: 'Prisma error' }] },
    { data: {} },
  ]) {
    await assert.rejects(
      () => load(async () => response)(params),
      /Prisma error|Missing council work page/
    )
  }
})

test('failure on a later page rejects instead of returning partial counts', async () => {
  let calls = 0
  const fetch = load(async () =>
    calls++ === 0
      ? { data: { councilWorkPage: { speeches: items(100, 's'), bills: [] } } }
      : { errors: [{ message: 'Prisma error' }] }
  )
  await assert.rejects(() => fetch(params), /Prisma error/)
})
