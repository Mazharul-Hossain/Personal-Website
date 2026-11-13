/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/NETLIFY_SSR_NOTES.md
Consumer: tests/service-worker/service-worker.test.mjs; launches only an owned isolated browser. */
import { spawn } from 'node:child_process';
import { existsSync, createWriteStream } from 'node:fs';
import { mkdir, readFile, rm } from 'node:fs/promises';
import { join, resolve, delimiter, dirname } from 'node:path';

export const delay = (ms, signal) => new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(signal.reason); return; }
    const done = () => { signal?.removeEventListener('abort', abort); resolve(); };
    const timer = setTimeout(done, ms);
    const abort = () => { clearTimeout(timer); signal.removeEventListener('abort', abort); reject(signal.reason); };
    signal?.addEventListener('abort', abort, { once: true });
});

export function chromeExecutable() {
    if (process.env.CHROME_BIN) {
        if (!existsSync(process.env.CHROME_BIN)) throw new Error(`CHROME_BIN does not exist: ${process.env.CHROME_BIN}`);
        return process.env.CHROME_BIN;
    }
    const paths = process.platform === 'win32'
        ? [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA].filter(Boolean).map(root => join(root, 'Google/Chrome/Application/chrome.exe'))
        : ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
    for (const dir of (process.env.PATH || '').split(delimiter)) for (const name of ['chrome', 'chrome.exe', 'google-chrome', 'chromium', 'chromium-browser']) paths.push(join(dir, name));
    const executable = paths.find(path => existsSync(path));
    if (!executable) throw new Error('Chrome/Chromium not found. Set CHROME_BIN to its executable path.');
    return executable;
}

async function connect(url) {
    const socket = new WebSocket(url), pending = new Map(), events = [];
    let id = 0;
    await new Promise((resolve, reject) => {
        const timer = setTimeout(() => { socket.close(); reject(new Error('Chrome WebSocket connection timed out')); }, 10000);
        socket.onopen = () => { clearTimeout(timer); resolve(); };
        socket.onerror = () => { clearTimeout(timer); reject(new Error('Chrome WebSocket connection failed')); };
    });
    const fail = error => { for (const task of [...pending.values()]) task.reject(error); };
    socket.onclose = () => fail(new Error('Chrome connection closed'));
    socket.onmessage = event => {
        let message;
        try { message = JSON.parse(event.data); } catch (error) { fail(error); return; }
        const task = pending.get(message.id);
        if (task) message.error ? task.reject(new Error(`${task.method}: ${message.error.message}`)) : task.resolve(message.result);
        else if (['Page.frameNavigated', 'Runtime.exceptionThrown', 'Network.loadingFailed'].includes(message.method)) events.push(message);
    };
    return {
        events,
        send(method, params = {}, signal, timeout = 30000) {
            return new Promise((resolve, reject) => {
                if (signal?.aborted) { reject(signal.reason); return; }
                if (socket.readyState !== WebSocket.OPEN) { reject(new Error(`Chrome closed before ${method}`)); return; }
                const next = ++id;
                const finish = callback => value => { clearTimeout(timer); signal?.removeEventListener('abort', abort); pending.delete(next); callback(value); };
                const abort = () => pending.get(next)?.reject(signal.reason);
                const timer = setTimeout(() => pending.get(next)?.reject(new Error(`${method} timed out`)), timeout);
                pending.set(next, { method, resolve: finish(resolve), reject: finish(reject) });
                signal?.addEventListener('abort', abort, { once: true });
                try { socket.send(JSON.stringify({ id: next, method, params })); } catch (error) { pending.get(next)?.reject(error); }
            });
        },
        close() { fail(new Error('Test closed Chrome connection')); socket.close(); }
    };
}

export async function launchChrome({ directory, signal }) {
    const executable = chromeExecutable(), profile = join(directory, 'chrome-profile');
    await mkdir(profile); // directory is a newly owned per-run artifact folder.
    const log = createWriteStream(join(directory, 'chrome.log'));
    const child = spawn(executable, ['--headless=new', '--remote-debugging-address=127.0.0.1', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--disable-background-networking'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
    child.stderr?.pipe(log);
    let spawnError; child.on('error', error => { spawnError = error; });
    let owner, stopped = false;
    async function close() {
        if (stopped) return; stopped = true;
        if (owner) { try { await owner.send('Browser.close', {}, undefined, 3000); } catch {} owner.close(); }
        if (child.exitCode === null && child.signalCode === null && !spawnError) {
            await Promise.race([new Promise(resolve => child.once('exit', resolve)), delay(3000)]);
            if (child.exitCode === null && child.signalCode === null) child.kill(); // Only the process spawned above.
            await Promise.race([new Promise(resolve => child.once('exit', resolve)), delay(3000)]);
        }
        log.end();
        if (child.exitCode === null && child.signalCode === null && !spawnError) throw new Error('Owned Chrome did not stop');
        if (dirname(resolve(profile)) !== resolve(directory)) throw new Error('Refusing profile cleanup outside owned run directory');
        await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    }
    try {
        let port, socketPath;
        const deadline = Date.now() + 20000;
        while (Date.now() < deadline) {
            signal?.throwIfAborted();
            if (spawnError) throw spawnError;
            if (child.exitCode !== null) throw new Error(`Chrome exited (${child.exitCode}); see chrome.log`);
            try { [port, socketPath] = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).trim().split(/\r?\n/); if (port && socketPath) break; await delay(100, signal); }
            catch (error) { if (error.code !== 'ENOENT') throw error; await delay(100, signal); }
        }
        if (!port || !socketPath) throw new Error('Chrome debugging endpoint did not start; see chrome.log');
        owner = await connect(`ws://127.0.0.1:${port}${socketPath}`);
        return {
            close,
            async page(origin, pageSignal) {
                const { browserContextId } = await owner.send('Target.createBrowserContext', {}, pageSignal);
                let rpc;
                try {
                    const { targetId } = await owner.send('Target.createTarget', { url: 'about:blank', browserContextId }, pageSignal);
                    rpc = await connect(`ws://127.0.0.1:${port}/devtools/page/${targetId}`);
                    const send = (method, params = {}) => rpc.send(method, params, pageSignal);
                    const evaluate = async expression => {
                        const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
                        if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
                        return result.result.value;
                    };
                    const wait = async (expression, description, timeout = 25000) => {
                        const deadline = Date.now() + timeout;
                        while (Date.now() < deadline) {
                            pageSignal?.throwIfAborted();
                            try { if (await evaluate(expression)) return; }
                            catch (error) { if (!/context.*destroyed|Cannot find context|Inspected target navigated/i.test(error.message)) throw error; }
                            await delay(100, pageSignal);
                        }
                        throw new Error(`Timed out: ${description}`);
                    };
                    await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
                    await send('Network.setBlockedURLs', { urls: ['*googletagmanager.com*', '*google-analytics.com*', '*fonts.googleapis.com*', '*fonts.gstatic.com*'] });
                    return {
                        send, evaluate, wait, events: rpc.events,
                        get documentNavigations() { return rpc.events.filter(event => event.method === 'Page.frameNavigated' && !event.params.frame.parentId).length; },
                        async go(path, bootstrap = true) {
                            const result = await send('Page.navigate', { url: new URL(path, origin).href });
                            if (result.errorText) throw new Error(`Navigation failed: ${result.errorText}`);
                            await wait('document.readyState === "complete" && !!document.querySelector("app-root h2")' + (bootstrap ? ' && (window.getAllAngularTestabilities?.().length || 0) > 0 && window.getAllAngularTestabilities().every(testability => testability.isStable())' : ''), `page ${path}`);
                        },
                        async spa(path) { await evaluate(`history.pushState({}, '', ${JSON.stringify(path)}); dispatchEvent(new PopStateEvent('popstate'));`); },
                        async close() { rpc.close(); await owner.send('Target.disposeBrowserContext', { browserContextId }, undefined, 5000); }
                    };
                } catch (error) {
                    rpc?.close(); await owner.send('Target.disposeBrowserContext', { browserContextId }, undefined, 5000).catch(() => {}); throw error;
                }
            }
        };
    } catch (error) { await close(); throw error; }
}
