const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

// Load the actual resolver and access policy without starting CMS or a database.
/** @param {string} relativePath @returns {any} Runtime-transpiled module exports. */
function loadSource(relativePath) {
  const filename = path.resolve(__dirname, '..', relativePath)
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  })
  const module = { exports: {} }
  const identity = (/** @type {unknown} */ value) => value
  vm.runInNewContext(
    outputText,
    {
      module,
      exports: module.exports,
      require(/** @type {string} */ name) {
        if (name === '@keystone-6/core') {
          return {
            list: identity,
            graphql: { field: identity, String: 'String', Int: 'Int' },
          }
        }
        if (name === '@keystone-6/core/fields') {
          return Object.fromEntries(
            [
              'text',
              'relationship',
              'select',
              'integer',
              'checkbox',
              'json',
              'virtual',
            ].map((name) => [name, identity])
          )
        }
        if (name === './utils/access-control-list')
          return loadSource('lists/utils/access-control-list.ts')
        if (name === '../../environment-variables')
          return { nodeEnv: 'production' }
        if (name === './utils/common-field')
          return { CREATED_AT: () => ({}), UPDATED_AT: () => ({}) }
        if (name === '../utils/logger') return { logger: {} }
        if (name === './fields/scrollable-relationship')
          return { scrollableRelationship: identity }
        return require(name)
      },
    },
    { filename }
  )
  return module.exports
}

const memberList = loadSource('lists/CouncilMember.ts').default
const resolve = memberList.fields.latestSpeechDate.field.resolve

/** @param {string | undefined} role @param {Date | null} date */
function contextFor(role, date) {
  /** @type {unknown[]} */
  const calls = []
  return {
    calls,
    session: role ? { data: { role } } : undefined,
    prisma: {
      councilSpeech: {
        aggregate: async (/** @type {unknown} */ args) => {
          calls.push(JSON.parse(JSON.stringify(args)))
          return { _max: { date } }
        },
      },
    },
  }
}

test('allowed roles aggregate only the dates linked to this membership', async () => {
  for (const role of [
    'owner',
    'admin',
    'editor',
    'developer_headless_account',
  ]) {
    const context = contextFor(role, new Date('2026-07-30T00:00:00.000Z'))
    assert.equal(await resolve({ id: '67' }, {}, context), '2026-07-30')
    assert.deepEqual(context.calls, [
      {
        where: { councilMember: { some: { id: 67 } } },
        _max: { date: true },
      },
    ])
  }
})

test('members without speeches return null', async () => {
  const context = contextFor('developer_headless_account', null)
  assert.equal(await resolve({ id: 67 }, {}, context), null)
})

test('anonymous and unsupported roles cannot read aggregated speech dates', async () => {
  for (const role of [undefined, 'unsupported']) {
    const context = contextFor(role, new Date())
    assert.equal(
      await memberList.access.operation.query({
        context,
        session: context.session,
        listKey: 'CouncilMember',
        operation: 'query',
      }),
      false
    )
    assert.equal(await resolve({ id: 67 }, {}, context), null)
    assert.equal(context.calls.length, 0)
  }
})

test('database errors propagate instead of silently clearing indexed dates', async () => {
  const context = contextFor('developer_headless_account', null)
  context.prisma.councilSpeech.aggregate = async () => {
    throw new Error('database unavailable')
  }
  await assert.rejects(
    () => resolve({ id: 67 }, {}, context),
    /database unavailable/
  )
})

test('GraphQL schema exposes the nullable date string', () => {
  const { buildSchema, isObjectType } = require('graphql')
  const schema = buildSchema(
    fs.readFileSync(path.resolve(__dirname, '../schema.graphql'), 'utf8')
  )
  const memberType = schema.getType('CouncilMember')
  assert.ok(memberType && isObjectType(memberType))
  assert.equal(String(memberType.getFields().latestSpeechDate.type), 'String')
})
