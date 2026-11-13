/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/NETLIFY_SSR_NOTES.md
Implementation: tests/service-worker/fixture-server.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { startFixture } from './fixture-server.mjs';

async function fixture(run) {
    const parent = fileURLToPath(new URL('../../tmp/', import.meta.url)); await mkdir(parent, { recursive: true });
    const root = await mkdtemp(join(parent, 'cache-fixture-'));
    const a = join(root, 'a'), b = join(root, 'b');
    for (const [dir, version] of [[a, 'A'], [b, 'B']]) {
        await mkdir(join(dir, 'research'), { recursive: true });
        await writeFile(join(dir, 'research/index.html'), `<h2>Research ${version}</h2>`);
        await writeFile(join(dir, 'main.js'), `// ${version}`);
        await writeFile(join(dir, 'ngsw.json'), JSON.stringify({ version }));
    }
    await writeFile(join(root, 'outside.txt'), 'must not be served');
    const server = await startFixture({ a, b });
    try { await run(server); } finally { await server.close(); }
}

test('serves the active build on an assigned loopback port and switches pages/assets', async () => fixture(async server => {
    assert.match(server.origin, /^http:\/\/127\.0\.0\.1:\d+$/);
    assert.equal(await (await fetch(server.origin + '/research')).text(), '<h2>Research A</h2>');
    server.state.build = 'b';
    assert.equal(await (await fetch(server.origin + '/research/')).text(), '<h2>Research B</h2>');
    const asset = await fetch(server.origin + '/main.js');
    assert.match(asset.headers.get('content-type'), /javascript/);
    assert.equal(await asset.text(), '// B');
    assert.ok(server.requests.some(row => row.build === 'b' && row.status === 200));
}));
test('can hold the old manifest while new build files are served', async () => fixture(async server => {
    server.state.build = 'b'; server.state.holdManifest = true;
    assert.deepEqual(await (await fetch(server.origin + '/ngsw.json?ngsw-cache-bust=1')).json(), { version: 'A' });
    assert.equal(await (await fetch(server.origin + '/main.js')).text(), '// B');
}));
test('missing chunks and encoded path traversal never become HTML or expose parent files', async () => fixture(async server => {
    server.state.blocked.add('/main.js');
    assert.equal((await fetch(server.origin + '/main.js')).status, 404);
    assert.equal((await fetch(server.origin + '/does-not-exist.js')).status, 404);
    const outside = await fetch(server.origin + '/..%2Foutside.txt');
    assert.equal(outside.status, 403); assert.doesNotMatch(await outside.text(), /must not be served/);
}));
test('models feed error contracts and unavailable transport, then closes only its server', async () => fixture(async server => {
    server.state.feedStatus = 502;
    const feed = await fetch(server.origin + '/feed');
    assert.equal(feed.status, 502); assert.equal(typeof (await feed.json()).error, 'string');
    server.state.available = false;
    await assert.rejects(fetch(server.origin + '/feed', { signal: AbortSignal.timeout(2000) }));
    server.state.available = true;
    assert.equal((await fetch(server.origin + '/main.js')).status, 200);
    const origin = server.origin; await server.close();
    await assert.rejects(fetch(origin + '/main.js', { signal: AbortSignal.timeout(2000) }));
}));
