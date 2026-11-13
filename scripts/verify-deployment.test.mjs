/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#local-and-netlify-verification; docs/NETLIFY_SSR_NOTES.md
Implementation: scripts/verify-deployment.mjs; exercises real local HTTP failure boundaries. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { verifyDeployment } from './verify-deployment.mjs';

async function fixture(run, changes = {}, withoutWorker = false) {
    const buildDir = await mkdtemp(join(tmpdir(), 'portfolio-deploy-check-'));
    const home = '<title>Home</title><h2>Home research</h2><script src="/main-ABC.js"></script>';
    const research = '<title>Research</title><h2>Selected research</h2><script src="/main-ABC.js"></script>';
    const files = { 'index.html': home, 'research/index.html': research, 'main-ABC.js': 'console.log("build A")', 'media/icon.woff2': 'font fixture bytes', 'ngsw-worker.js': '// actual worker', 'ngsw.json': '{"index":"/index.csr.html"}', 'manifest.webmanifest': '{"icons":[]}' };
    if (withoutWorker) { delete files['ngsw-worker.js']; delete files['ngsw.json']; }
    for (const [path, content] of Object.entries(files)) { await mkdir(join(buildDir, path, '..'), { recursive: true }); await writeFile(join(buildDir, path), content); }
    const routes = {
        '/': [200, 'text/html', home], '/research/': [200, 'text/html', research],
        '/main-ABC.js': [200, 'text/javascript', files['main-ABC.js']],
        '/media/icon.woff2': [200, 'font/woff2', files['media/icon.woff2']],
        '/ngsw-worker.js': [200, 'text/javascript', files['ngsw-worker.js']],
        '/ngsw.json': [200, 'application/json', files['ngsw.json']],
        '/manifest.webmanifest': [200, 'application/manifest+json', files['manifest.webmanifest']],
        '/feed': [200, 'application/json', '[]'],
        ...(withoutWorker ? { '/ngsw-worker.js': [404, 'text/plain', 'not found'], '/ngsw.json': [404, 'text/plain', 'not found'] } : {}),
        ...changes
    };
    const server = createServer((request, response) => {
        const [status, mime, body, extra = {}] = routes[request.url] || [404, 'text/plain', 'not found'];
        response.writeHead(status, { 'content-type': mime, 'cache-control': 'public, max-age=0', ...extra }); response.end(body);
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    try { await run(await verifyDeployment({ url: `http://127.0.0.1:${server.address().port}`, buildDir, commit: 'declared-sha' })); }
    finally {
        await new Promise(resolve => server.close(resolve));
        assert.equal(dirname(resolve(buildDir)), resolve(tmpdir()));
        assert.ok(buildDir.includes('portfolio-deploy-check-'));
        await rm(buildDir, { recursive: true, force: true });
    }
}

test('accepts matching rendered pages/assets and records identity as unverified', async () => fixture(report => {
    assert.equal(report.ok, true, report.failures.join('\n'));
    assert.equal(report.declaredIdentity.independentlyVerified, false);
    assert.equal(report.requests.filter(row => row.path === '/main-ABC.js').length, 2);
    assert.equal(report.requests[0].headers['cache-control'], 'public, max-age=0');
}));
test('detects a successful CSR fallback in place of standalone HTML', async () => fixture(report => {
    assert.ok(report.failures.some(message => message.includes('rendered heading')));
}, { '/research/': [200, 'text/html', '<title>Research</title><app-root></app-root>'] }));
test('detects stale script bytes even when the filename and MIME are correct', async () => fixture(report => {
    assert.ok(report.failures.some(message => message.includes('bytes differ')));
}, { '/main-ABC.js': [200, 'text/javascript', 'console.log("old build")'] }));
test('rejects HTML masquerading as a worker or missing JS asset', async () => fixture(report => {
    assert.ok(report.failures.some(message => message.includes('ngsw-worker.js')));
    assert.ok(report.failures.some(message => message.includes('Missing JS asset')));
}, { '/ngsw-worker.js': [200, 'text/html', '<app-root></app-root>'], '/__deployment-verification-missing__.js': [200, 'text/html', '<app-root></app-root>'] }));
test('does not follow a redirect to a different deploy origin', async () => fixture(report => {
    assert.ok(report.failures.some(message => message.includes('Cross-origin redirect')));
}, { '/research/': [302, 'text/plain', '', { location: 'https://example.invalid/research/' }] }));
test('distinguishes a valid upstream outage from a successful live feed', async () => fixture(report => {
    assert.equal(report.ok, true, report.failures.join('\n'));
    assert.ok(report.warnings.some(message => message.includes('upstream unavailable')));
}, { '/feed': [504, 'application/json', '{"error":"temporarily unavailable"}'] }));
test('rejects feed navigation fallback HTML', async () => fixture(report => {
    assert.ok(report.failures.some(message => message.includes('/feed: invalid JSON')));
}, { '/feed': [200, 'text/html', '<app-root></app-root>'] }));
test('accepts intentionally absent worker output only with real missing-file responses', async () => fixture(report => {
    assert.equal(report.expectedWorker, false);
    assert.equal(report.ok, true, report.failures.join('\n'));
}, {}, true));
test('detects a stale deployed worker when the local build does not generate one', async () => fixture(report => {
    assert.equal(report.expectedWorker, false);
    assert.ok(report.failures.some(message => message.includes('local build has no worker')));
}, { '/ngsw-worker.js': [200, 'text/javascript', '// stale deployed worker'] }, true));
test('detects stale HTML entry references even with matching content and available current assets', async () => fixture(report => {
    assert.ok(report.failures.some(message => message.includes('references differ')));
}, { '/research/': [200, 'text/html', '<title>Research</title><h2>Selected research</h2><script src="/old-build.js"></script>'] }));
test('rejects a manifest that omits the expected launch/icon settings', async () => fixture(report => {
    assert.ok(report.failures.some(message => message.includes('Web manifest: differs')));
}, { '/manifest.webmanifest': [200, 'application/manifest+json', '{}'] }));
test('detects HTML served for a generated font', async () => fixture(report => {
    assert.ok(report.failures.some(message => message.includes('media/icon.woff2: missing asset')));
}, { '/media/icon.woff2': [200, 'text/html', '<app-root></app-root>'] }));
