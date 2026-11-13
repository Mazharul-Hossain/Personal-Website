/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/NETLIFY_SSR_NOTES.md
Configuration: angular.json; verifies actual generated output, not registration source. */
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';

try {
    const root = resolve(process.argv[2] || 'dist/my-app/browser');
    const manifest = JSON.parse(await readFile(join(root, 'ngsw.json'), 'utf8'));
    assert.ok((await readFile(join(root, 'ngsw-worker.js'))).length > 0, 'Worker script is missing/empty');
    assert.equal(manifest.index, '/index.csr.html', 'Expected the application builder CSR index');
    assert.ok(manifest.hashTable[manifest.index], 'CSR index must be versioned');
    assert.deepEqual(manifest.navigationUrls, [], 'Page navigation must stay on the network');
    assert.deepEqual(manifest.dataGroups, [], 'Feed/data requests must not be cached');
    const groupFor = url => manifest.assetGroups.find(group => group.urls.includes(url));
    const modeFor = (url, installMode) => {
        assert.equal(groupFor(url)?.installMode, installMode, `${url}: incorrect installation caching mode`);
        assert.equal(groupFor(url)?.updateMode, 'prefetch', `${url}: expected prefetch updates for previously cached assets`);
    };
    const files = await readdir(root);
    for (const entry of ['/favicon.ico', '/manifest.webmanifest', manifest.index]) modeFor(entry, 'prefetch');
    const styles = files.filter(file => file.endsWith('.css'));
    assert.ok(styles.length > 0, 'Generated CSS missing');
    for (const style of styles) modeFor('/' + style, 'prefetch');
    const scripts = files.filter(file => file.endsWith('.js') && !/^(ngsw-worker|safety-worker|worker-basic)/.test(file));
    assert.ok(scripts.length > 0, 'Application scripts missing');
    for (const file of scripts) {
        const entry = /^(main|polyfills|scripts)-/.test(file);
        modeFor('/' + file, entry ? 'prefetch' : 'lazy');
    }
    const fonts = (await readdir(join(root, 'media'))).filter(file => /\.(woff2?|ttf|otf)$/.test(file));
    assert.ok(fonts.some(file => file.endsWith('.woff2')), 'Generated WOFF2 missing');
    async function assetFiles(directory) {
        const paths = [];
        for (const entry of await readdir(join(root, directory), { withFileTypes: true })) {
            const name = directory + '/' + entry.name;
            paths.push(...(entry.isDirectory() ? await assetFiles(name) : [name]));
        }
        return paths;
    }
    const assets = [...await assetFiles('assets'), ...await assetFiles('media')];
    assert.ok(assets.some(file => /\.(png|webp|svg)$/.test(file)), 'Image assets missing');
    for (const asset of assets) modeFor('/' + asset, 'lazy');
    assert.equal(groupFor('/feed'), undefined, 'Feed must not be an asset');
    for (const [url, expected] of Object.entries(manifest.hashTable)) {
        const file = resolve(root, '.' + url);
        assert.ok(file.startsWith(root + '/') || file.startsWith(root + '\\'), `Resource leaves build directory: ${url}`);
        const actual = createHash('sha1').update(await readFile(file)).digest('hex');
        assert.equal(actual, expected, `Manifest content hash mismatch: ${url}`);
    }
    console.log(`Service-worker output valid: ${scripts.length} scripts, ${styles.length} styles, ${fonts.length} generated fonts, ${assets.length} on-demand assets, ${Object.keys(manifest.hashTable).length} content hashes; page/feed network policy preserved.`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
