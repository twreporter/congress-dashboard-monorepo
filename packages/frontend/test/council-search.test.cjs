const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

// Exercise the real scope configuration without loading Next.js or a browser.
function loadSource(relativePath) {
  const filename = path.resolve(__dirname, '../src', relativePath + '.ts')
  const source = fs.readFileSync(filename, 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  })
  const module = { exports: {} }
  new Function('require', 'module', 'exports', outputText)(
    (name) =>
      name.startsWith('@/') ? loadSource(name.slice(2)) : require(name),
    module,
    module.exports
  )
  return module.exports
}

const {
  scopeValues,
  getScopeSearchStages,
  buildCouncilFilter,
  councilScopeValues,
} = loadSource('components/search/result-page/scope-config')

test('speech comes before bills in all council scopes and global results', () => {
  for (const scope of councilScopeValues) {
    assert.deepEqual(getScopeSearchStages(scope), [
      'councilor',
      'council-topic',
      'council-speech',
      'council-bill',
    ])
  }
  assert.deepEqual(getScopeSearchStages(scopeValues.all), [
    'legislator',
    'councilor',
    'topic',
    'council-topic',
    'speech',
    'council-speech',
    'council-bill',
  ])
  assert.deepEqual(getScopeSearchStages(scopeValues.legislativeYuan), [
    'legislator',
    'topic',
    'speech',
  ])
})

test('council filtering isolates cities without constraining all councils', () => {
  assert.equal(
    buildCouncilFilter(scopeValues.taipeiCouncil),
    'councilSlug: taipei'
  )
  assert.equal(
    buildCouncilFilter(scopeValues.newTaipeiCouncil),
    'councilSlug: new-taipei'
  )
  assert.equal(buildCouncilFilter(scopeValues.allCouncils), '')
})

test('both environments index all speakers, summary and title, not transcript content', () => {
  for (const env of ['staging', 'prod']) {
    const {
      settings,
    } = require(`../src/components/search/algolia-config/${env}/council-speech.settings.json`)
    assert.deepEqual(settings.searchableAttributes, [
      'councilorNames',
      'unordered(summary)',
      'unordered(title)',
    ])
    assert.deepEqual(settings.customRanking, [
      'desc(dateTs)',
      'asc(councilRank)',
    ])
    assert.deepEqual(settings.attributesForFaceting, [
      'filterOnly(councilSlug)',
      'filterOnly(meetingTerm)',
    ])
  }
})
