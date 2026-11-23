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

test('fetches the complete snapshot in one request, preserving counts', async () => {
  const calls = []
  const fetch = load(async (body) => {
    calls.push(JSON.parse(body).variables)
    return {
      data: {
        councilWork: { speeches: items(103, 's'), bills: items(201, 'b') },
      },
    }
  })
  const result = await fetch(params)
  assert.equal(result.speechCount, 103)
  assert.equal(result.billCount, 201)
  assert.equal(result.work.length, 304)
  assert.deepEqual(calls, [params])
})

test('empty snapshot produces zero counts', async () => {
  const fetch = load(async () => ({
    data: { councilWork: { speeches: [], bills: [] } },
  }))
  assert.deepEqual(await fetch(params), {
    work: [],
    speechCount: 0,
    billCount: 0,
  })
})

test('GraphQL errors and missing results never become successful empty results', async () => {
  for (const response of [
    { errors: [{ message: 'Prisma error' }] },
    { data: {} },
    {
      data: { councilWork: { speeches: items(1, 's'), bills: [] } },
      errors: [{ message: 'Prisma error' }],
    },
  ]) {
    await assert.rejects(
      () => load(async () => response)(params),
      /Prisma error|Missing council work result/
    )
  }
})
