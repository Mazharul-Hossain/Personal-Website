/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/NETLIFY_SSR_NOTES.md
Tests: tests/service-worker/fixture-server.test.mjs; consumer: tests/service-worker/service-worker.test.mjs */
import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { resolve, relative, isAbsolute, join, extname, sep } from 'node:path';

const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.avif': 'image/avif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

export async function startFixture({ a, b }) {
    const roots = { a: resolve(a), b: resolve(b) };
    for (const root of Object.values(roots)) if (!statSync(root).isDirectory()) throw new Error(`Not a build directory: ${root}`);
    const state = { build: 'a', holdManifest: false, available: true, feedStatus: 200, blocked: new Set() };
    const requests = [];
    const server = createServer((request, response) => {
        const row = { url: request.url, build: state.build, available: state.available };
        requests.push(row);
        const send = (status, body, type = 'text/plain') => {
            row.status = status;
            response.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' }); response.end(body);
        };
        try {
            if (!state.available) { row.transportFailure = true; request.socket.destroy(); return; }
            if (request.method !== 'GET') { send(405, 'Read-only test server'); return; }
            let pathname;
            try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
            catch { send(400, 'Invalid URL'); return; }
            row.path = pathname;
            if (pathname === '/feed') {
                send(state.feedStatus, JSON.stringify(state.feedStatus === 200 ? [] : { error: 'Writing feed is temporarily unavailable' }), 'application/json'); return;
            }
            if (state.blocked.has(pathname)) { send(404, 'Deliberately missing test resource'); return; }
            const build = state.holdManifest && pathname === '/ngsw.json' ? 'a' : state.build;
            row.servedBuild = build;
            const root = roots[build];
            let file = resolve(root, '.' + pathname);
            const local = relative(root, file);
            if (isAbsolute(local) || local === '..' || local.startsWith('..' + sep)) { send(403, 'Outside build directory'); return; }
            try { if (statSync(file).isDirectory()) file = join(file, 'index.html'); }
            catch (error) { if (['ENOENT', 'ENOTDIR'].includes(error.code)) { send(404, 'Not found'); return; } throw error; }
            try { send(200, readFileSync(file), types[extname(file)] || 'application/octet-stream'); }
            catch (error) { if (['ENOENT', 'ENOTDIR', 'EISDIR'].includes(error.code)) send(404, 'Not found'); else throw error; }
        } catch (error) {
            row.error = error.message;
            if (!response.headersSent) send(500, 'Test fixture failed'); else response.destroy(error);
        }
    });
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
    const origin = `http://127.0.0.1:${server.address().port}`;
    let closing;
    return {
        state, requests, origin,
        close() {
            closing ??= new Promise((resolve, reject) => {
                server.close(error => error ? reject(error) : resolve()); server.closeAllConnections();
            });
            return closing;
        }
    };
}
