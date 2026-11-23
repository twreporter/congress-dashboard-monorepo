const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

/** @param {string} filename @returns {any} */
function load(filename) {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  })
  const module = { exports: {} }
  new Function('require', 'module', 'exports', outputText)(
    (/** @type {string} */ name) => {
      if (name.endsWith('environment-variables'))
        return { nodeEnv: 'production' }
      if (name.startsWith('.'))
        return load(path.resolve(path.dirname(filename), name + '.ts'))
      return require(name)
    },
    module,
    module.exports
  )
  return module.exports
}
const { councilWorkResolver, councilWorkTypeDefs } = load(
  path.resolve(__dirname, '../extend-graphql-schemas/council-work.ts')
)
const resolve = councilWorkResolver.Query.councilWorkPage
const args = {
  councilorSlug: 'member',
  topicSlug: 'topic',
  councilMeetingId: 4,
  take: 100,
  skip: 200,
}

/** @param {string | undefined} role */
function contextFor(role) {
  /** @type {any[]} */
  const calls = []
  const findMany = async (/** @type {any} */ query) => {
    calls.push(query)
    return [
      {
        slug: 'work',
        date: new Date('2026-11-01T00:00:00Z'),
        title: 'Title',
        summary: '<ul><li>Summary</li></ul>',
      },
    ]
  }
  return {
    calls,
    session: role ? { data: { role } } : undefined,
    prisma: {
      councilSpeech: { findMany },
      councilBill: { findMany },
      $queryRaw: async (
        /** @type {TemplateStringsArray} */ sql,
        /** @type {number} */ id
      ) => {
        calls.push({ sql: sql.join('?'), id })
        return [{ count: 12000n }]
      },
    },
  }
}

test('work reads are bounded, scoped and exclude transcript content', async () => {
  const context = contextFor('developer_headless_account')
  const result = await resolve(null, args, context)
  assert.equal(context.calls.length, 2)
  for (const query of context.calls) {
    assert.deepEqual(query, {
      where: {
        councilMeetingId: 4,
        councilMember: { some: { councilor: { slug: 'member' } } },
        topic: { some: { slug: 'topic' } },
      },
      select: { slug: true, date: true, title: true, summary: true },
      orderBy: [{ date: 'desc' }, { id: 'desc' }],
      take: 100,
      skip: 200,
    })
  }
  assert.equal(result.speeches[0].date, '2026-11-01')
  assert.equal(result.speeches[0].summaryFallback, 'Summary')
  assert.equal(result.bills[0].summaryFallback, 'Summary')
})

test('count uses the indexed membership links and returns a number', async () => {
  const context = contextFor('developer_headless_account')
  assert.equal(
    await councilWorkResolver.CouncilMember.totalSpeechCount(
      { id: '67' },
      {},
      context
    ),
    12000
  )
  assert.equal(context.calls[0].id, 67)
  assert.match(
    context.calls[0].sql,
    /FROM `_CouncilMember_speech`\s+WHERE A = \?/
  )
})

test('both resolvers deny anonymous and unsupported roles before database access', async () => {
  for (const role of [undefined, 'unsupported']) {
    const context = contextFor(role)
    await assert.rejects(() => resolve(null, args, context), /Access denied/)
    await assert.rejects(
      () =>
        councilWorkResolver.CouncilMember.totalSpeechCount(
          { id: 67 },
          {},
          context
        ),
      /Access denied/
    )
    assert.equal(context.calls.length, 0)
  }
})

test('invalid pagination is rejected before database access', async () => {
  for (const patch of [{ take: 101 }, { take: 0 }, { skip: -1 }]) {
    const context = contextFor('admin')
    await assert.rejects(
      () => resolve(null, { ...args, ...patch }, context),
      /take must/
    )
    assert.equal(context.calls.length, 0)
  }
})

test('database failures propagate', async () => {
  const context = contextFor('admin')
  context.prisma.councilSpeech.findMany = async () => {
    throw new Error('DB failed')
  }
  await assert.rejects(() => resolve(null, args, context), /DB failed/)
})

test('schema extensions merge with the checked-in schema', () => {
  const { buildSchema, validateSchema } = require('graphql')
  const { mergeSchemas } = require('@graphql-tools/schema')
  const schema = buildSchema(
    fs.readFileSync(path.resolve(__dirname, '../schema.graphql'), 'utf8')
  )
  assert.deepEqual(
    validateSchema(
      mergeSchemas({
        schemas: [schema],
        typeDefs: [councilWorkTypeDefs],
        resolvers: [councilWorkResolver],
      })
    ),
    []
  )
})
