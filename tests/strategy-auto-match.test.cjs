'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const { run } = require('../scripts/auto-match-strategy-test.cjs')

test('retired scheduler never constructs providers, even if old flags remain enabled', async () => {
  const fail = () => { throw new Error('provider must not be used') }
  const result = await run({ env: { STRATEGY_AUTO_MATCH_TEST: 'true', STRATEGY_MODE: 'test' }, storeFactory: fail, readerFactory: fail, ziinaFactory: fail })
  assert.deepEqual(result, { disabled: true })
})
test('installed cron runs a harmless no-op and does not display private settings', () => {
  const result = spawnSync(process.execPath, ['scripts/auto-match-strategy-test.cjs'], { env: { ...process.env, STRATEGY_AUTO_MATCH_TEST: 'true', Z_A_KEY: 'private-value-test' }, encoding: 'utf8' })
  assert.equal(result.status, 0)
  assert.match(result.stdout, /matching is disabled/)
  assert.equal(result.stdout.includes('private-value-test'), false)
  assert.equal(result.stderr.includes('private-value-test'), false)
})
