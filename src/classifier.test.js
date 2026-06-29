const { test } = require('node:test');
const assert = require('node:assert/strict');
const { classify } = require('./classifier');

const healthy = { status: 'healthy' };
const degraded = { status: 'degraded' };
const down = { status: 'down' };

// P1 — service down (takes precedence over HTTP code)
test('P1 — service down, any HTTP code', () => {
  assert.equal(classify({ http_status: 200 }, down), 'P1');
  assert.equal(classify({ http_status: 401 }, down), 'P1');
});

test('P1 — HTTP 5xx, healthy service', () => {
  assert.equal(classify({ http_status: 500 }, healthy), 'P1');
  assert.equal(classify({ http_status: 503 }, healthy), 'P1');
});

// P2 — service degraded (takes precedence over HTTP code)
test('P2 — service degraded, any HTTP code', () => {
  assert.equal(classify({ http_status: 200 }, degraded), 'P2');
  assert.equal(classify({ http_status: 401 }, degraded), 'P2');
});

test('P2 — HTTP 429, healthy service', () => {
  assert.equal(classify({ http_status: 429 }, healthy), 'P2');
});

// P3 — client-side auth errors, healthy service
test('P3 — HTTP 401, healthy service', () => {
  assert.equal(classify({ http_status: 401 }, healthy), 'P3');
});

test('P3 — HTTP 403, healthy service', () => {
  assert.equal(classify({ http_status: 403 }, healthy), 'P3');
});

// P4 — everything else
test('P4 — HTTP 200 with complaint', () => {
  assert.equal(classify({ http_status: 200 }, healthy), 'P4');
});

test('P4 — HTTP 404, healthy service', () => {
  assert.equal(classify({ http_status: 404 }, healthy), 'P4');
});
