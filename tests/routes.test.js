import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync, mkdirSync, existsSync } from 'node:fs';

const SAMPLES = {
  'boxes/__sample_box__.md': `---
title: "Sample Box"
platform: HTB
difficulty: Easy
os: Linux
date: 2026-02-01
status: retired
summary: "A sample retired box."
tags: [smb]
---

## Recon
Sample recon body.
`,
  'boxes/__sample_draft__.md': `---
title: "Draft Box"
platform: THM
difficulty: Medium
os: Windows
date: 2026-03-01
status: retired
summary: "Should not be published."
draft: true
---

Draft body.
`,
};

before(() => {
  for (const [path, body] of Object.entries(SAMPLES)) {
    mkdirSync(path.split('/')[0], { recursive: true });
    writeFileSync(path, body);
  }
  try {
    execFileSync('npx', ['astro', 'build'], { stdio: 'pipe', encoding: 'utf8' });
  } finally {
    for (const path of Object.keys(SAMPLES)) rmSync(path, { force: true });
  }
});

test('a published box generates a route', () => {
  assert.ok(existsSync('dist/boxes/__sample_box__/index.html'));
});

test('the box index lists the published box', () => {
  const html = readFileSync('dist/boxes/index.html', 'utf8');
  assert.match(html, /Sample Box/);
});

test('a draft box generates no route and is not listed', () => {
  assert.ok(!existsSync('dist/boxes/__sample_draft__/index.html'));
  const html = readFileSync('dist/boxes/index.html', 'utf8');
  assert.doesNotMatch(html, /Draft Box/);
});

test('every internal link is prefixed with the base path', () => {
  const html = readFileSync('dist/boxes/index.html', 'utf8');
  const hrefs = [...html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]);
  assert.ok(hrefs.length > 0, 'expected internal links');
  for (const link of hrefs) {
    assert.ok(link.startsWith('/writeups/'), `unprefixed internal link: ${link}`);
  }
});

test('the displayed date matches the frontmatter date regardless of timezone', () => {
  // The sample box is dated 2026-02-01. A date-only value parses as UTC
  // midnight, so formatting it in a negative-offset timezone would render
  // "31 Jan 2026". This asserts the UTC-forced formatter.
  const html = readFileSync('dist/boxes/__sample_box__/index.html', 'utf8');
  assert.match(html, /1 Feb 2026/);
  assert.doesNotMatch(html, /31 Jan 2026/);
});

test('no emitted link contains a doubled slash', () => {
  const html = readFileSync('dist/boxes/index.html', 'utf8');
  assert.doesNotMatch(html, /href="\/\//);
});
