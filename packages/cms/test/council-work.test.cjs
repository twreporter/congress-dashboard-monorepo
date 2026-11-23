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
const resolve = councilWorkResolver.Query.councilWork
const args = {
  councilorSlug: 'member',
  topicSlug: 'topic',
  councilMeetingId: 4,
}

/** @param {string | undefined} role */
function contextFor(role) {
  /** @type {any[]} */
  const calls = []
  /** @returns {Promise<any[]>} */
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
      /** @param {(tx: any) => Promise<any>} callback @param {any} options */
      async $transaction(callback, options) {
        assert.deepEqual(options, {
          isolationLevel: 'RepeatableRead',
          timeout: 30000,
        })
        return callback(this)
      },
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
      skip: 0,
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

test('bill previews preserve summary and content fallback semantics', async () => {
  const context = contextFor('admin')
  const summaries = [
    '## 說明\nA summary',
    null,
    '',
    { text: 'ignored' },
    ['ignored'],
    42,
    false,
  ]
  const content = '## 說明\n<ul><li>' + '文'.repeat(130) + '</li></ul>'
  const rows = summaries.map((summary, i) => ({
    slug: String(i),
    date: new Date('2026-11-01'),
    title: 'Bill',
    summary,
  }))
  /** @type {any[]} */
  const contentReads = []
  context.prisma.councilBill.findMany = async (query) => {
    if (query.select.content) {
      contentReads.push(query)
      return query.where.slug.in.map((/** @type {string} */ slug) => ({
        slug,
        content,
      }))
    }
    return rows
  }
  const result = await resolve(null, args, context)
  assert.equal(result.bills[0].summaryFallback, 'A summary')
  for (const bill of result.bills.slice(1))
    assert.equal(bill.summaryFallback, '文'.repeat(100))
  assert.deepEqual(contentReads, [
    {
      where: { slug: { in: ['1', '2', '3', '4', '5', '6'] } },
      select: { slug: true, content: true },
    },
  ])
})

test('null fallback content remains null', async () => {
  const context = contextFor('admin')
  context.prisma.councilBill.findMany = async (query) =>
    query.select.content
      ? [{ slug: 'bill', content: null }]
      : [
          {
            slug: 'bill',
            date: new Date('2026-11-01'),
            title: 'Bill',
            summary: null,
          },
        ]
  assert.equal(
    (await resolve(null, args, context)).bills[0].summaryFallback,
    null
  )
})

test('date and membership changes between batches cannot change the collection snapshot', async () => {
  const context = contextFor('admin')
  const live = Array.from({ length: 102 }, (_, id) => ({
    slug: String(id),
    date: new Date(2026, 0, 103 - id),
    title: 'Speech',
    summary: '',
    member: true,
  }))
  /** @type {number[]} */
  const offsets = []
  context.prisma.$transaction = async (callback, options) => {
    assert.equal(options.isolationLevel, 'RepeatableRead')
    const snapshot = live.map((row) => ({ ...row }))
    return callback({
      councilSpeech: {
        findMany: async (/** @type {any} */ query) => {
          offsets.push(query.skip)
          if (query.skip === 0) {
            // An unread speech moves ahead of page one; another loses membership.
            live[100].date = new Date(2027, 0, 1)
            live[101].member = false
          }
          return snapshot
            .filter((row) => row.member)
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(query.skip, query.skip + query.take)
        },
      },
      councilBill: { findMany: async () => [] },
    })
  }
  // Reads outside the transaction must never be used for any batch.
  context.prisma.councilSpeech.findMany = async () => {
    throw new Error('outside snapshot')
  }
  const result = await resolve(null, args, context)
  assert.deepEqual(offsets, [0, 100])
  assert.deepEqual(
    result.speeches.map((/** @type {any} */ row) => row.slug),
    live.map((row) => row.slug)
  )
  assert.equal(
    new Set(result.speeches.map((/** @type {any} */ row) => row.slug)).size,
    102
  )
})

test('a failed later batch rejects the entire snapshot collection', async () => {
  const context = contextFor('admin')
  context.prisma.councilSpeech.findMany = async (query) => {
    if (query.skip) throw new Error('snapshot timed out')
    return Array.from({ length: 100 }, (_, id) => ({
      slug: String(id),
      date: new Date('2026-11-01'),
      title: 'Speech',
      summary: '',
    }))
  }
  await assert.rejects(() => resolve(null, args, context), /snapshot timed out/)
})

test('bill-only collections continue past full batches and include every card', async () => {
  const context = contextFor('admin')
  context.prisma.councilSpeech.findMany = async () => []
  const bills = Array.from({ length: 201 }, (_, id) => ({
    slug: String(id),
    date: new Date('2026-11-01'),
    title: 'Bill',
    summary: 'Summary',
  }))
  /** @type {number[]} */
  const offsets = []
  context.prisma.councilBill.findMany = async (query) => {
    assert.equal(query.select.content, undefined)
    offsets.push(query.skip)
    return bills.slice(query.skip, query.skip + query.take)
  }
  const result = await resolve(null, args, context)
  assert.deepEqual(offsets, [0, 100, 200])
  assert.equal(result.speeches.length, 0)
  assert.deepEqual(
    result.bills.map((/** @type {any} */ bill) => bill.slug),
    bills.map((bill) => bill.slug)
  )
})
