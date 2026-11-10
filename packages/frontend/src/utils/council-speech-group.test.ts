import assert from 'node:assert/strict'
import { it } from 'node:test'
import { getSpeechNeighbors } from './council-speech-group.ts'

it('disables both directions for ungrouped, missing, and single speeches', () => {
  for (const slugs of [[], ['other'], ['current']]) {
    assert.deepEqual(getSpeechNeighbors(slugs, 'current'), {
      previous: undefined,
      next: undefined,
    })
  }
})

it('follows supplied group order and stops at both boundaries', () => {
  const slugs = ['third', 'first', 'second']
  assert.deepEqual(getSpeechNeighbors(slugs, 'third'), {
    previous: undefined,
    next: 'first',
  })
  assert.deepEqual(getSpeechNeighbors(slugs, 'first'), {
    previous: 'third',
    next: 'second',
  })
  assert.deepEqual(getSpeechNeighbors(slugs, 'second'), {
    previous: 'first',
    next: undefined,
  })
})
