import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync, rmSync, mkdirSync } from 'node:fs';

function build() {
  try {
    execFileSync('npx', ['astro', 'build'], {
      encoding: 'utf8',
      stdio: 'pipe',
      env: { ...process.env, FORCE_COLOR: '0' },
    });
    return { ok: true, output: '' };
  } catch (err) {
    return { ok: false, output: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
}

const FIXTURE = 'boxes/__guard_fixture__.md';

function writeFixture(status) {
  mkdirSync('boxes', { recursive: true });
  writeFileSync(
    FIXTURE,
    `---\ntitle: "Guard Fixture"\nplatform: HTB\ndifficulty: Easy\nos: Linux\ndate: 2026-01-01\nstatus: ${status}\nsummary: "Schema guard fixture."\n---\n\nBody.\n`,
  );
}

test('a retired box writeup builds', () => {
  writeFixture('retired');
  try {
    const result = build();
    assert.equal(result.ok, true, `expected build to succeed:\n${result.output}`);
  } finally {
    rmSync(FIXTURE, { force: true });
  }
});

test('an active box writeup fails the build', () => {
  writeFixture('active');
  try {
    const result = build();
    assert.equal(result.ok, false, 'expected the build to FAIL for status: active');
    assert.match(result.output, /expected "retired"/);
  } finally {
    rmSync(FIXTURE, { force: true });
  }
});

test('TEMPLATE.md does not become a route', () => {
  const result = build();
  assert.equal(result.ok, true, `expected build to succeed:\n${result.output}`);
  assert.throws(
    () => execFileSync('test', ['-e', 'dist/boxes/TEMPLATE/index.html']),
    'TEMPLATE.md must not generate a route',
  );
});
