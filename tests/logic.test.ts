import assert from 'node:assert/strict'
import test from 'node:test'
import { buildMinimizedHandoff, canRequestReview, runSimulatedTriage, validateIntake } from '../src/logic.ts'
import type { Intake } from '../src/types.ts'

const complete: Intake = {
  incident: 'payment',
  recency: 'today',
  access: 'control',
  money: 'loss',
}

test('rejects incomplete and unknown enum values', () => {
  assert.equal(validateIntake({ ...complete, incident: '' }).length, 1)
  assert.equal(validateIntake({ ...complete, recency: 'tomorrow' as Intake['recency'] }).length, 1)
  assert.equal(validateIntake(complete).length, 0)
})

test('recent payment loss puts the bank first', () => {
  const result = runSimulatedTriage(complete)
  assert.equal(result.priority, 'inmediata')
  assert.equal(result.steps[0]?.id, 'bank')
  assert.match(result.title, /banco/i)
})

test('active account takeover puts platform recovery first', () => {
  const result = runSimulatedTriage({ incident: 'account', recency: 'now', access: 'lost', money: 'none' })
  assert.equal(result.priority, 'inmediata')
  assert.equal(result.steps[0]?.id, 'platform')
})

test('human-review capacity accepts only the published range', () => {
  assert.equal(canRequestReview(3), true)
  assert.equal(canRequestReview(1), true)
  assert.equal(canRequestReview(0), false)
  assert.equal(canRequestReview(-1), false)
  assert.equal(canRequestReview(4), false)
  assert.equal(canRequestReview(1.5), false)
})

test('handoff is categorical and excludes direct identifiers', () => {
  const result = runSimulatedTriage(complete)
  const handoff = buildMinimizedHandoff(complete, result)
  assert.equal(handoff.identityStatus, 'no verificada')
  assert.deepEqual(Object.keys(handoff).sort(), ['access', 'excluded', 'identityStatus', 'incident', 'money', 'priority', 'recency'].sort())
  assert.ok(handoff.excluded.includes('contrasenas'))
  assert.ok(handoff.excluded.includes('datos bancarios'))
})
