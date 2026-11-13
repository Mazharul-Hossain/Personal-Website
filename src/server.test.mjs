/* @agent Read: .agents/skills/portfolio-angular/SKILL.md; .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/BUNDLE_OPTIMIZATION_PLAN.md
Implementation: src/server.ts; run against production output with the manifest test:server command. */
import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Configure an explicit local host before the compiled engine captures its allowlist.
for (const name of ['URL', 'DEPLOY_URL', 'DEPLOY_PRIME_URL']) process.env[name] = 'http://localhost';
for (const name of ['DEPLOY_ID', 'SITE_ID', 'SITE_NAME']) process.env[name] = 'server-response-test';
const build = resolve(process.env.SERVER_TEST_BUILD_DIR || 'dist/my-app');
const { netlifyAppEngineHandler } = await import(pathToFileURL(resolve(build, 'server/server.mjs')).href);
const request = path => netlifyAppEngineHandler(new Request('http://localhost' + path));
afterEach(() => mock.restoreAll());

test('missing JavaScript returns a real 404 without redirecting to an HTML page', async () => {
    for (const path of ['/missing-chunk.js', '/missing-module.mjs?version=old', '/assets/missing.JS']) {
        const response = await request(path);
        assert.equal(response.status, 404, path);
        assert.equal(response.headers.get('location'), null, path);
        assert.match(response.headers.get('content-type'), /text\/plain/);
        assert.equal(await response.text(), 'Not found');
    }
});

test('known document routes retain their rendered content', async () => {
    for (const [path, title] of [['/research', 'Research'], ['/publications', 'Publications'], ['/work', 'Projects']]) {
        const response = await request(path);
        assert.equal(response.status, 200, path);
        assert.match(response.headers.get('content-type'), /text\/html/);
        assert.ok((await response.text()).includes('<title>' + title), path);
    }
});

test('unknown document routes retain the existing 404-page redirect', async () => {
    const response = await request('/unknown-document');
    assert.equal(response.status, 302);
    assert.equal(response.headers.get('location'), '/404');
});

test('the writing feed still uses its upstream response rather than the asset guard', async () => {
    mock.method(globalThis, 'fetch', async () => new Response('<rss><channel><item><title>Writing</title></item></channel></rss>'));
    const response = await request('/feed');
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), [{ title: 'Writing' }]);
});
