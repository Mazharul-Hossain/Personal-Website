/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/NETLIFY_SSR_NOTES.md
Helpers: tests/service-worker/chrome.mjs; tests/service-worker/fixture-server.mjs
Implementation: src/app/shared/chunk-load-recovery.service.ts; src/app/blogs/blogs.component.ts */
import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createWriteStream, readFileSync } from 'node:fs';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { startFixture } from './fixture-server.mjs';
import { launchChrome, delay } from './chrome.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(import.meta.url);
const interrupted = new AbortController();
const interrupt = () => interrupted.abort(new Error('Production test run interrupted'));
process.once('SIGINT', interrupt); process.once('SIGTERM', interrupt);
let directory, a, b, chrome;

async function command(name, args, signal) {
    const log = createWriteStream(join(directory, name + '.log'));
    const child = spawn(process.execPath, args, { cwd: root, signal, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    child.stdout.pipe(log, { end: false }); child.stderr.pipe(log, { end: false });
    try {
        await new Promise((resolve, reject) => {
            let error;
            child.once('error', value => { error = value; });
            child.once('close', code => error ? reject(error) : code === 0 ? resolve() : reject(new Error(`${name} exited ${code}; see ${join(directory, name + '.log')}`)));
        });
    } finally { log.end(); }
}

function buildInfo(path) {
    const browser = join(path, 'browser');
    const html = route => readFileSync(join(browser, route, 'index.html'), 'utf8');
    const stats = JSON.parse(readFileSync(join(path, 'browser-stats.json')));
    const eager = new Set();
    const visit = name => {
        if (eager.has(name)) return;
        eager.add(name);
        for (const dependency of stats.outputs[name]?.imports || []) {
            if (dependency.kind !== 'dynamic-import' && !dependency.external) visit(dependency.path);
        }
    };
    for (const script of html('research').matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) visit(script[1].replace(/^\//, ''));
    assert.ok(eager.size > 0, 'Prerendered entry scripts must be discoverable');
    assert.ok(![...eager].some(name => Object.keys(stats.outputs[name]?.inputs || {}).some(input => input.includes('node_modules/@angular/cdk/'))), 'CDK popup dependencies must remain outside the eager script graph');
    const owner = suffix => {
        const matches = Object.entries(stats.outputs).filter(([, output]) => Object.keys(output.inputs).some(input => input.endsWith(suffix)));
        assert.equal(matches.length, 1, `Expected one browser chunk for ${suffix}`); return '/' + matches[0][0];
    };
    const manifest = JSON.parse(readFileSync(join(browser, 'ngsw.json')));
    const font = Object.keys(manifest.hashTable).find(path => path.startsWith('/media/') && path.endsWith('.woff2'));
    assert.ok(font, 'Generated local icon font missing');
    const fontBytes = readFileSync(join(browser, font));
    const publications = [...html('publications').matchAll(/data-publication-id=/g)].length;
    const figures = [...html('research').matchAll(/class="research-figure"/g)].length;
    assert.ok(publications > 0 && figures > 0, 'Prerendered expected content missing');
    return { browser, manifest, font, fontBytes: fontBytes.length, fontHash: createHash('sha256').update(fontBytes).digest('hex'), publications, figures, popupChunk: owner('shared/image-popup.ts'), detailsChunk: owner('publication-details.ts'), researchHtml: html('research') };
}

before(async context => {
    const signal = AbortSignal.any([context.signal, interrupted.signal]);
    const parent = resolve(root, process.env.CACHE_TEST_OUTPUT_DIR || 'tmp/service-worker-tests');
    await mkdir(parent, { recursive: true }); directory = await mkdtemp(join(parent, 'run-'));
    console.log(`Production cache-test artifacts: ${directory}`);
    const suppliedA = process.env.CACHE_TEST_BUILD_A, suppliedB = process.env.CACHE_TEST_BUILD_B;
    assert.equal(Boolean(suppliedA), Boolean(suppliedB), 'Set both CACHE_TEST_BUILD_A and CACHE_TEST_BUILD_B, or neither');
    await command('guidance', [join(root, 'scripts/check-guidance.mjs')], signal);
    let paths;
    if (suppliedA) paths = [resolve(root, suppliedA), resolve(root, suppliedB)];
    else {
        const cli = require.resolve('@angular/cli/bin/ng.js');
        paths = [join(directory, 'build-a'), join(directory, 'build-b')];
        for (const [index, output] of paths.entries()) {
            console.log(`Building production ${index === 0 ? 'A' : 'B'}…`);
            await command(`build-${index === 0 ? 'a' : 'b'}`, [cli, 'build', '--configuration', 'production', '--stats-json', '--output-path', output, ...(index === 1 ? ['--named-chunks'] : [])], signal);
        }
    }
    for (const [index, path] of paths.entries()) await command(`output-${index}`, [join(root, 'scripts/check-service-worker.mjs'), join(path, 'browser')], signal);
    [a, b] = paths.map(buildInfo);
    assert.notEqual(a.popupChunk, b.popupChunk, 'A/B need different real chunk URLs; build B with named chunks');
    assert.notEqual(a.detailsChunk, b.detailsChunk, 'Bibliography URLs must change for recovery coverage');
    assert.notDeepEqual(a.manifest.hashTable, b.manifest.hashTable, 'A/B must contain changed compiled assets');
    assert.equal(a.publications, b.publications); assert.equal(a.figures, b.figures);
    assert.equal(a.fontHash, b.fontHash, 'These build variants should share the unchanged font');
    await writeFile(join(directory, 'builds.json'), JSON.stringify({ paths, reused: Boolean(suppliedA), popup: [a.popupChunk, b.popupChunk], details: [a.detailsChunk, b.detailsChunk], expected: { publications: a.publications, figures: a.figures } }, null, 2));
    chrome = await launchChrome({ directory, signal });
}, { timeout: 1200000 });

after(async () => {
    try { await chrome?.close(); }
    finally { process.removeListener('SIGINT', interrupt); process.removeListener('SIGTERM', interrupt); }
}, { timeout: 20000 });

const cachePaths = `(async()=>{const all=[];for(const key of await caches.keys())all.push(...(await(await caches.open(key)).keys()).map(request=>new URL(request.url).pathname));return all;})()`;
const fallbackVisibility = `(()=>{
    const message=document.querySelector('#blog .writing-state:not([role="status"])');
    const link=document.querySelector('#blog .writing-link[href^="https:"]');
    const visible=element=>{
        if(!element)return false;
        const rect=element.getBoundingClientRect();if(rect.width<=0||rect.height<=0)return false;
        for(let node=element;node;node=node.parentElement){const style=getComputedStyle(node);if(node.hidden||style.display==='none'||style.visibility!=='visible'||Number(style.opacity)===0||style.contentVisibility==='hidden')return false;}
        return true;
    };
    return{messageVisible:visible(message),linkVisible:visible(link),message:message?.textContent.trim(),linkText:link?.textContent.trim(),href:link?.href};
})()`;

for (const pendingManifest of [false, true]) {
    test(pendingManifest ? 'recovers with the worker still on A, without waiting for an update' : 'recovers with a ready B worker; checks Medium fallback, network pages, offline assets and loop guard', { timeout: 120000 }, async context => {
        const signal = AbortSignal.any([context.signal, interrupted.signal]);
        const server = await startFixture({ a: a.browser, b: b.browser });
        let page;
        const report = { passed: false, pendingManifest, origin: server.origin, checks: [], requests: server.requests };
        async function step(name, run) {
            try { await run(); report.checks.push({ name, passed: true }); context.diagnostic(`PASS: ${name}`); }
            catch (error) { report.checks.push({ name, passed: false, error: error.message }); throw error; }
        }
        const publicationReady = `location.pathname === '/publications' && document.querySelectorAll('app-publications li[data-publication-id]').length === ${b.publications} && (window.getAllAngularTestabilities?.().length || 0) > 0 && window.getAllAngularTestabilities().every(testability => testability.isStable())`;
        try {
            page = await chrome.page(server.origin, signal);
            await step('real worker control and lazy installation boundaries', async () => {
                await page.go('/home/'); await page.wait('!!navigator.serviceWorker.controller', 'worker control');
                assert.equal(await page.evaluate('fetch("/manifest.webmanifest").then(response=>response.status)'), 200);
                await page.wait(`(async()=> (await ${cachePaths}).some(path=>path.startsWith('/main-')))()`, 'worker cache initialization');
                const cached = await page.evaluate(cachePaths);
                assert.ok(!cached.includes(a.popupChunk) && !cached.includes(a.detailsChunk), 'Unused lazy chunks must not be prefetched');
            });
            if (!pendingManifest) await step('Medium 502/504 keep a visible fallback without automatic reload', async () => {
                report.feedFallback = [];
                for (const status of [502, 504]) {
                    server.state.feedStatus = status;
                    const before = page.documentNavigations;
                    await page.go('/blog');
                    await page.wait(`!!document.querySelector('#blog .writing-state:not([role="status"])') && document.querySelector('#blog .writing-state').textContent.includes('Medium') && !!document.querySelector('#blog .writing-link[href^="https:"]')`, `Medium ${status} fallback`);
                    const fallback = await page.evaluate(fallbackVisibility);
                    assert.equal(fallback.messageVisible, true, `Medium ${status} fallback must be rendered`);
                    assert.equal(fallback.linkVisible, true, `Medium ${status} archive link must be rendered`);
                    assert.match(fallback.message, /Medium/); assert.match(fallback.linkText, /Medium/);
                    report.feedFallback.push({ status, ...fallback });
                    const origin = await page.evaluate('performance.timeOrigin'); await delay(300, signal);
                    assert.equal(page.documentNavigations - before, 1, 'Only the explicit navigation is allowed');
                    assert.equal(await page.evaluate('performance.timeOrigin'), origin);
                    assert.ok(server.requests.some(row => row.path === '/feed' && row.status === status));
                }
                server.state.feedStatus = 200; await page.go('/home/');
            });
            await step('research popup warms on demand while bibliography stays deferred', async () => {
                await page.spa('/research'); await page.wait(`document.querySelectorAll('.research-figure').length === ${a.figures}`, 'Research activation');
                await page.evaluate('document.querySelector(".research-image-preview").click()'); await page.wait('!!document.querySelector(".popup-image")', 'popup open');
                await page.evaluate('document.querySelector(".popup-close").click()'); assert.equal(await page.evaluate('document.activeElement === document.querySelector(".research-image-preview")'), true);
                await page.spa('/home'); await page.wait(`(async()=> (await ${cachePaths}).includes(${JSON.stringify(a.popupChunk)}))()`, 'Popup caching');
                assert.ok(!(await page.evaluate(cachePaths)).includes(a.detailsChunk));
            });
            server.state.build = 'b'; server.state.holdManifest = pendingManifest;
            if (!pendingManifest) await step('detects a real changed-asset B version', async () => {
                report.update = await page.evaluate(`new Promise((resolve,reject)=>{const timer=setTimeout(()=>{navigator.serviceWorker.removeEventListener('message',listener);reject(new Error('VERSION_READY timeout'))},20000);function listener(event){if(event.data.type==='VERSION_READY'){clearTimeout(timer);navigator.serviceWorker.removeEventListener('message',listener);resolve(event.data)}}navigator.serviceWorker.addEventListener('message',listener);navigator.serviceWorker.controller.postMessage({action:'CHECK_FOR_UPDATES',nonce:1});})`);
            });
            else await step('worker confirms no update while the fixture holds manifest A', async () => {
                report.updateCheck = await page.evaluate(`new Promise((resolve,reject)=>{const timer=setTimeout(()=>{navigator.serviceWorker.removeEventListener('message',listener);reject(new Error('Update check timeout'))},20000);function listener(event){if(event.data.type==='OPERATION_COMPLETED'&&event.data.nonce===2){clearTimeout(timer);navigator.serviceWorker.removeEventListener('message',listener);resolve(event.data)}}navigator.serviceWorker.addEventListener('message',listener);navigator.serviceWorker.controller.postMessage({action:'CHECK_FOR_UPDATES',nonce:2});})`);
                assert.equal(report.updateCheck.result, false, 'The worker must still have only build A');
                assert.ok(server.requests.some(row => row.path === '/ngsw.json' && row.build === 'b' && row.servedBuild === 'a'));
            });
            await step('old warmed code works; missing old chunk reloads the requested B route', async () => {
                await page.spa('/research'); await page.wait(`document.querySelectorAll('.research-figure').length === ${a.figures}`, 'old research page');
                await page.evaluate('document.querySelector(".research-image-preview").click()'); await page.wait('!!document.querySelector(".popup-image")', 'old warmed popup');
                await page.evaluate('document.querySelector(".popup-close").click()');
                const previous = await page.evaluate('performance.timeOrigin');
                await page.spa('/publications?category=journal#papers'); await page.wait(publicationReady, 'automatic recovery and hydrated bibliography');
                report.recovery = await page.evaluate('({timeOrigin:performance.timeOrigin,path:location.pathname,query:location.search,fragment:location.hash})');
                assert.notEqual(report.recovery.timeOrigin, previous, 'Recovery must create a new document');
                assert.equal(report.recovery.query, '?category=journal'); assert.equal(report.recovery.fragment, '#papers');
                assert.ok(server.requests.some(row => row.path === a.detailsChunk && row.build === 'b' && row.status === 404), 'An actual old chunk must fail');
                if (pendingManifest) assert.ok(server.requests.some(row => row.path === '/ngsw.json' && row.build === 'b' && row.servedBuild === 'a'));
            });
            if (!pendingManifest) await step('network-rendered no-JS pages, cached font and uncached offline pages/feed', async () => {
                await page.go('/research/'); await page.evaluate('document.querySelector(".research-image-preview").click()'); await page.wait('!!document.querySelector(".popup-image")', 'new Research popup'); await page.evaluate('document.querySelector(".popup-close").click()');
                await page.send('Emulation.setScriptExecutionDisabled', { value: true });
                const before = server.requests.length; await page.go('/research/', false);
                assert.equal(await page.evaluate('document.querySelectorAll(".research-figure").length'), a.figures);
                assert.equal(await page.evaluate('document.title'), await page.evaluate(`new DOMParser().parseFromString(${JSON.stringify(a.researchHtml)}, 'text/html').title`));
                assert.ok(server.requests.slice(before).some(row => row.path === '/research/' && row.status === 200), 'Navigation must reach the network');
                await page.send('Emulation.setScriptExecutionDisabled', { value: false }); await page.go('/home/');
                await page.evaluate(`fetch(${JSON.stringify(b.font)}).then(response=>response.arrayBuffer())`);
                assert.ok(!(await page.evaluate(cachePaths)).includes('/feed'));
                server.state.available = false; await page.send('Network.setCacheDisabled', { cacheDisabled: true });
                report.offlineFont = await page.evaluate(`fetch(${JSON.stringify(b.font)}).then(async response=>{const body=await response.arrayBuffer();return{status:response.status,bytes:body.byteLength,hash:[...new Uint8Array(await crypto.subtle.digest('SHA-256',body))].map(n=>n.toString(16).padStart(2,'0')).join('')}})`);
                assert.equal(report.offlineFont.status, 200); assert.equal(report.offlineFont.bytes, b.fontBytes); assert.equal(report.offlineFont.hash, b.fontHash);
                report.offlineFeed = await page.evaluate('fetch("/feed").then(response=>({status:response.status})).catch(()=>({networkFailure:true}))');
                assert.ok(report.offlineFeed.networkFailure || report.offlineFeed.status >= 500, 'Offline feed must not return cached success');
                await page.send('Emulation.setScriptExecutionDisabled', { value: true });
                const navigation = await page.send('Page.navigate', { url: server.origin + '/research/' });
                await page.wait('document.readyState === "complete"', 'offline navigation completion');
                const url = await page.evaluate('location.href');
                assert.ok(navigation.errorText || url.startsWith('chrome-error://'), 'Offline navigation must fail, not serve cached CSR HTML');
                assert.equal(await page.evaluate('document.querySelectorAll(".research-figure").length'), 0);
            });
            await step('persisted guard prevents another reload after another missing chunk', async () => {
                server.state.available = true; await page.send('Emulation.setScriptExecutionDisabled', { value: false });
                // A fresh research document leaves the bibliography cold in the JS module map,
                // while sessionStorage retains the cooldown from the earlier recovery.
                await page.go('/research');
                report.evicted = await page.evaluate(`(async()=>{let deleted=0;for(const key of await caches.keys())if(await(await caches.open(key)).delete(${JSON.stringify(server.origin + b.detailsChunk)}))deleted++;return deleted;})()`);
                if (!pendingManifest) assert.ok(report.evicted > 0, 'Evict exactly the latest-version bibliography resource');
                const origin = await page.evaluate('performance.timeOrigin'), before = page.documentNavigations;
                server.state.blocked.add(b.detailsChunk); await page.spa('/publications');
                await page.wait(`location.pathname === '/research' && document.querySelectorAll('.research-figure').length === ${b.figures} && (window.getAllAngularTestabilities?.().length || 0) > 0 && window.getAllAngularTestabilities().every(testability=>testability.isStable())`, 'failed navigation leaves the working page');
                await delay(300, signal);
                assert.ok(server.requests.some(row => row.path === b.detailsChunk && row.status === 404), 'The latest-version chunk must actually fail');
                assert.equal(await page.evaluate('performance.timeOrigin'), origin); assert.equal(page.documentNavigations, before, 'Cooldown must prevent another automatic document navigation');
                report.loopGuard = { timeOrigin: origin, documentNavigations: before, preventedReload: true };
            });
            await step('unavailable popup offers its original image when reload recovery is guarded', async () => {
                await page.evaluate(`(async()=>{for(const key of await caches.keys())await(await caches.open(key)).delete(${JSON.stringify(server.origin + b.popupChunk)});})()`);
                server.state.blocked.add(b.popupChunk);
                const origin = await page.evaluate('performance.timeOrigin'), before = page.documentNavigations;
                const source = await page.evaluate('document.querySelector(".research-image-preview img").getAttribute("src")');
                await page.evaluate('document.querySelector(".research-image-preview").click()');
                await page.wait('!!document.querySelector("app-selected-research [role=alert] a")', 'original-image fallback');
                assert.equal(await page.evaluate('document.querySelector("app-selected-research [role=alert] a").getAttribute("href")'), source);
                assert.ok(server.requests.some(row => row.path === b.popupChunk && row.status === 404), 'The popup module must actually fail to download');
                assert.equal(await page.evaluate('document.querySelector("[role=dialog]")'), null);
                assert.equal(await page.evaluate('performance.timeOrigin'), origin);
                assert.equal(page.documentNavigations, before, 'Popup failure must respect the same persisted cooldown');
            });
            report.passed = true;
        } finally {
            try {
                if (page) { try { report.workerState = await page.evaluate('fetch("/ngsw/state").then(response=>response.text())'); } catch {} report.browserEvents = page.events; }
                await writeFile(join(directory, pendingManifest ? 'pending-update.json' : 'ready-update.json'), JSON.stringify(report, null, 2));
            } finally { try { await page?.close(); } finally { await server.close(); } }
        }
    });
}
