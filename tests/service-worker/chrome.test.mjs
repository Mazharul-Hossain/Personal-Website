/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/BUNDLE_OPTIMIZATION_PLAN.md
Implementation: tests/service-worker/chrome.mjs; real isolated Chrome with controlled startup-file errors. */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir, mkdtemp, readFile, access} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {launchChrome} from './chrome.mjs';

async function fixture(run) {
    const parent = fileURLToPath(new URL('../../tmp/browser-helper-tests/', import.meta.url));
    await mkdir(parent, {recursive: true});
    const directory = await mkdtemp(join(parent, 'run-'));
    let browser;
    const launch = async options => browser = await launchChrome({directory, signal: AbortSignal.timeout(30000), ...options});
    try { await run(launch); }
    finally { await browser?.close(); }
    await assert.rejects(access(join(directory, 'chrome-profile')), {code: 'ENOENT'});
}

test('recovers from transient busy startup-file reads and connects to real Chrome', async () => fixture(async launch => {
    let reads = 0;
    const browser = await launch({readStartupFile: async (...args) => {
        if (++reads <= 2) throw Object.assign(new Error('Startup file is locked'), {code: 'EBUSY'});
        return readFile(...args);
    }});
    assert.ok(reads >= 3, 'The same launch must retry the locked file');
    const page = await browser.page('http://127.0.0.1');
    try { assert.equal(await page.evaluate('6 * 7'), 42); }
    finally { await page.close(); }
}));

test('still waits for a startup file that does not exist yet', async () => fixture(async launch => {
    let reads = 0;
    await launch({readStartupFile: async (...args) => {
        if (++reads === 1) throw Object.assign(new Error('Not written yet'), {code: 'ENOENT'});
        return readFile(...args);
    }});
    assert.ok(reads >= 2);
}));

test('surfaces a permanent filesystem error and cleans up the owned profile', async () => fixture(async launch => {
    const denied = Object.assign(new Error('Permission denied'), {code: 'EACCES'});
    await assert.rejects(() => launch({readStartupFile: async (...args) => {
        await readFile(...args); // Fail on an existing startup file, after Chrome has started.
        throw denied;
    }}), error => error === denied);
}));

test('stops retrying a busy file when the launch is aborted', async () => fixture(async launch => {
    const controller = new AbortController(), reason = new Error('Test cancelled the launch');
    let reads = 0;
    await assert.rejects(() => launch({signal: controller.signal, readStartupFile: async (...args) => {
        await readFile(...args);
        if (++reads === 3) controller.abort(reason);
        throw Object.assign(new Error('Still locked'), {code: 'EBUSY'});
    }}), error => error === reason);
    assert.equal(reads, 3, 'Cancellation must stop further reads');
}));
