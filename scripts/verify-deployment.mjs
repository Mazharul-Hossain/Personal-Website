/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#local-and-netlify-verification; docs/NETLIFY_SSR_NOTES.md
Owner: package.json; read-only HTTP checks against a separately deployed build. */
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const hash = body => createHash('sha256').update(body).digest('hex');
const title = html => html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
const heading = html => html.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1].replace(/<[^>]*>/g, '').trim();
const headersToRecord = ['content-type', 'cache-control', 'cdn-cache-control', 'netlify-cdn-cache-control', 'cache-status', 'age', 'etag', 'location', 'x-nf-request-id'];
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(match => [match[1].toLowerCase(), match[2] ?? match[3]]));
function resourceReferences(html, pageUrl) {
    const base = new URL(attributes(html.match(/<base\b[^>]*>/i)?.[0] || '').href || pageUrl, pageUrl);
    const paths = [];
    for (const tag of html.match(/<(?:script|link)\b[^>]*>/gi) || []) {
        const attrs = attributes(tag);
        const target = /^<script/i.test(tag) ? attrs.src : /(?:^|\s)(?:stylesheet|modulepreload|preload)(?:\s|$)/i.test(attrs.rel || '') ? attrs.href : null;
        if (!target) continue;
        const url = new URL(target.replace(/&amp;/g, '&'), base);
        if (url.origin === new URL(pageUrl).origin) paths.push(url.pathname + url.search);
    }
    return [...new Set(paths)].sort();
}

export async function verifyDeployment({ url, buildDir, commit, deployId }) {
    const base = new URL(url);
    if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.pathname !== '/' || base.search || base.hash) {
        throw new Error('Use an HTTP(S) origin without credentials, a path, query or fragment.');
    }
    const entries = await readdir(buildDir, { withFileTypes: true });
    const hasWorker = entries.some(entry => entry.name === 'ngsw-worker.js');
    const report = {
        timestamp: new Date().toISOString(), origin: base.origin, buildDir: resolve(buildDir),
        declaredIdentity: { commit: commit || null, deployId: deployId || null, independentlyVerified: false },
        expectedWorker: hasWorker, requests: [], failures: [], warnings: [],
        limits: ['Matching HTML/assets does not prove per-request SSR or independently verify a Netlify deploy/commit.', 'HTTP checks bypass browser service workers; browser control, offline behavior and two-version updates require separate tests.', 'Repeated headers alone do not establish CDN TTL or invalidation.']
    };
    const check = (ok, message) => { if (!ok) report.failures.push(message); };
    async function request(path) {
        let current = new URL(path, base); const redirects = [];
        try {
            let response;
            for (let count = 0; count < 6; count++) {
                response = await fetch(current, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
                if (![301, 302, 303, 307, 308].includes(response.status)) break;
                const location = response.headers.get('location');
                if (!location) throw new Error('Redirect has no Location');
                const next = new URL(location, current);
                redirects.push({ status: response.status, from: current.href, to: next.href });
                if (next.origin !== base.origin) throw new Error('Cross-origin redirect: verify the intended deploy URL instead');
                await response.body?.cancel();
                current = next;
                if (count === 5) throw new Error('Too many redirects');
            }
            const body = Buffer.from(await response.arrayBuffer());
            const row = { path, finalUrl: current.href, status: response.status, redirects, headers: Object.fromEntries(headersToRecord.map(key => [key, response.headers.get(key)]).filter(([, value]) => value !== null)), bytes: body.length, sha256: hash(body) };
            report.requests.push(row);
            return { ...row, body, text: body.toString('utf8') };
        } catch (error) {
            report.requests.push({ path, redirects, error: error.message });
            report.failures.push(`${path}: ${error.message}`);
            return null;
        }
    }
    const pages = [{ path: '/', file: 'index.html' }];
    for (const entry of entries.filter(entry => entry.isDirectory())) {
        try { await readFile(join(buildDir, entry.name, 'index.html')); pages.push({ path: `/${entry.name}/`, file: `${entry.name}/index.html` }); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
    for (const page of pages) {
        const expected = await readFile(join(buildDir, page.file), 'utf8');
        const actual = await request(page.path); if (!actual) continue;
        check(actual.status === 200, `${page.path}: expected HTTP 200`);
        check(/text\/html/i.test(actual.headers['content-type'] || ''), `${page.path}: expected HTML MIME`);
        check(Boolean(title(expected)) && title(actual.text) === title(expected), `${page.path}: title differs from local build`);
        check(Boolean(heading(expected)) && heading(actual.text) === heading(expected), `${page.path}: rendered heading missing/different (possible CSR fallback)`);
        const pageUrl = new URL(page.path, base);
        check(JSON.stringify(resourceReferences(actual.text, actual.finalUrl)) === JSON.stringify(resourceReferences(expected, pageUrl)), `${page.path}: script/stylesheet/preload references differ from local build (possible stale HTML)`);
    }
    const files = entries.filter(entry => entry.isFile() && /\.(js|css)$/.test(entry.name) && !/^(ngsw-worker|safety-worker|worker-basic)/.test(entry.name)).map(entry => entry.name);
    try { files.push(...(await readdir(join(buildDir, 'media'))).filter(file => /\.(woff2?|ttf|otf)$/.test(file)).map(file => 'media/' + file)); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    for (const file of files) {
        const actual = await request('/' + file); if (!actual) continue;
        const mime = file.endsWith('.css') ? /text\/css/i : /\.(woff2?|ttf|otf)$/.test(file) ? /font\/|application\/(?:x-)?font/i : /javascript/i;
        check(actual.status === 200 && mime.test(actual.headers['content-type'] || ''), `${file}: missing asset, invalid MIME or HTML fallback`);
        check(actual.sha256 === hash(await readFile(join(buildDir, file))), `${file}: bytes differ from local build`);
    }
    if (files.length) await request('/' + files[0]); // Record repeated-response cache headers without inferring CDN behavior.
    const manifest = await request('/manifest.webmanifest');
    if (manifest) {
        try {
            check(manifest.status === 200, 'Web manifest: expected HTTP 200');
            check(/json|manifest/i.test(manifest.headers['content-type'] || ''), 'Web manifest: unexpected MIME');
            check(manifest.sha256 === hash(await readFile(join(buildDir, 'manifest.webmanifest'))), 'Web manifest: differs from local build');
            const parsed = JSON.parse(manifest.text);
            for (const icon of parsed.icons || []) {
                const iconUrl = new URL(icon.src, new URL('/manifest.webmanifest', base));
                if (iconUrl.origin !== base.origin) { report.warnings.push('External manifest icon not checked'); continue; }
                const actual = await request(iconUrl.pathname);
                if (actual) check(actual.status === 200 && /^image\//i.test(actual.headers['content-type'] || '') && actual.bytes > 0, `${icon.src}: invalid manifest icon`);
            }
        } catch { report.failures.push('Web manifest: invalid JSON'); }
    }
    for (const file of ['ngsw-worker.js', 'ngsw.json']) {
        const actual = await request('/' + file); if (!actual) continue;
        if (hasWorker) {
            check(actual.status === 200, `${file}: expected generated worker output`);
            check(actual.sha256 === hash(await readFile(join(buildDir, file))), `${file}: differs from local build or is HTML fallback`);
            check(file.endsWith('.json') ? /json/i.test(actual.headers['content-type'] || '') : /javascript/i.test(actual.headers['content-type'] || ''), `${file}: invalid MIME`);
        } else {
            check(actual.status === 404 || actual.status === 410, `${file}: local build has no worker; remote must return 404/410, not stale worker or HTML`);
        }
    }
    const feed = await request('/feed');
    if (feed) {
        try {
            check(/json/i.test(feed.headers['content-type'] || ''), '/feed: expected JSON MIME');
            const body = JSON.parse(feed.text);
            check(feed.status === 200 ? Array.isArray(body) : [502, 504].includes(feed.status) && typeof body.error === 'string', '/feed: invalid success/error contract');
            if (feed.status !== 200) report.warnings.push('/feed upstream unavailable; successful live feed remains unverified');
        } catch { report.failures.push('/feed: invalid JSON (possible navigation/HTML fallback)'); }
    }
    const missing = await request('/__deployment-verification-missing__.js');
    if (missing) check([404, 410].includes(missing.status), 'Missing JS asset returns a success/redirect fallback instead of 404/410');
    await request('/__deployment-verification-unknown-route__'); // Observe platform 404/redirect policy; no invented product contract.
    report.ok = report.failures.length === 0;
    return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        const args = process.argv.slice(2); const options = {};
        for (let i = 0; i < args.length; i += 2) {
            if (!['--url', '--build-dir', '--commit', '--deploy-id', '--out'].includes(args[i]) || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error('Usage: node scripts/verify-deployment.mjs --url <origin> --build-dir <browser-output> [--commit <sha>] [--deploy-id <id>] [--out <report.json>]');
            options[args[i].slice(2)] = args[i + 1];
        }
        if (!options.url || !options['build-dir']) throw new Error('--url and --build-dir are required; compare the exact build being deployed.');
        const report = await verifyDeployment({ url: options.url, buildDir: options['build-dir'], commit: options.commit, deployId: options['deploy-id'] });
        if (options.out) { await mkdir(dirname(resolve(options.out)), { recursive: true }); await writeFile(options.out, JSON.stringify(report, null, 2) + '\n'); }
        console.log(JSON.stringify(report, null, 2)); process.exitCode = report.ok ? 0 : 1;
    } catch (error) { console.error(error.message); process.exitCode = 1; }
}
