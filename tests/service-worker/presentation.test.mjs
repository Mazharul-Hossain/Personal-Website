/* @agent Read: .agents/skills/portfolio-verification/SKILL.md; .agents/skills/portfolio-design/SKILL.md
Policy: README.md#behavioral-contracts; docs/STYLESHEET_REFINEMENT_PLAN.md
Implementation: src/app/nav-bar/nav-bar.component.html; src/app/nav-bar/nav-bar.component.css; src/app/index-page/index-page.component.css
Helpers: tests/service-worker/chrome.mjs; tests/service-worker/fixture-server.mjs */
import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { launchChrome } from './chrome.mjs';
import { startFixture } from './fixture-server.mjs';

const browser = resolve(process.env.PRESENTATION_TEST_BROWSER_DIR || 'dist/my-app/browser');
const routes = ['/home', '/research', '/publications', '/experience', '/about', '/blog', '/contact'];
let chrome, directory;

// Assert what visitors can see, without prescribing a particular hiding declaration.
const visible = selector => `(()=>{
    const element=document.querySelector(${JSON.stringify(selector)});
    if(!element)return false;
    const rect=element.getBoundingClientRect();
    if(rect.width<=0||rect.height<=0)return false;
    for(let node=element;node;node=node.parentElement){
        const style=getComputedStyle(node);
        if(style.display==='none'||style.visibility!=='visible'||Number(style.opacity)===0)return false;
    }
    return true;
})()`;

before(async () => {
    await access(join(browser, 'research/index.html'));
    const parent = resolve('tmp/presentation-tests');
    await mkdir(parent, { recursive: true });
    directory = await mkdtemp(join(parent, 'run-'));
    chrome = await launchChrome({ directory, signal: AbortSignal.timeout(60000) });
    console.log('Presentation test artifacts: ' + directory);
}, { timeout: 90000 });

after(async () => { await chrome?.close(); }, { timeout: 20000 });

for (const width of [360, 1280]) {
    test(`ordinary navigation remains usable without JavaScript at ${width}px`, { timeout: 120000 }, async context => {
        const server = await startFixture({ a: browser, b: browser });
        let page;
        const result = { width, passed: false, destinations: [] };
        try {
            page = await chrome.page(server.origin, context.signal);
            await page.send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: width < 992 });
            await page.send('Emulation.setScriptExecutionDisabled', { value: true });
            await page.go('/research/', false);
            assert.deepEqual(await page.evaluate('Array.from(document.querySelectorAll(".navigation .page-scroll"), link=>link.getAttribute("href"))'), routes);
            for (const [index, route] of routes.entries()) {
                const point = await page.evaluate(`(()=>{
                    const link=document.querySelectorAll('.navigation .page-scroll')[${index}];
                    link.scrollIntoView({behavior:'instant',block:'center'});
                    const rect=link.getBoundingClientRect(), x=rect.left+rect.width/2, y=rect.top+rect.height/2;
                    return {x,y,visible:rect.width>0&&rect.height>0&&link.contains(document.elementFromPoint(x,y))};
                })()`);
                assert.equal(point.visible, true, `The ${route} link must be visible and unobscured`);
                await page.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: point.x, y: point.y, button: 'left', clickCount: 1 });
                await page.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: point.x, y: point.y, button: 'left', clickCount: 1 });
                await page.wait(`(location.pathname === ${JSON.stringify(route)} || location.pathname === ${JSON.stringify(route + '/')}) && document.readyState === 'complete' && !!document.querySelector('main h2')`, `native navigation to ${route}`);
                assert.equal(await page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1'), true, route + ' must fit the viewport');
                assert.equal(await page.evaluate('document.querySelector(".navigation a[aria-current=location]")?.getAttribute("href")'), route, 'Prerendered navigation must identify the current page');
                assert.equal(await page.evaluate('(window.getAllAngularTestabilities?.().length || 0)'), 0, 'The page must not bootstrap Angular');
                if (route === '/blog') {
                    assert.equal(await page.evaluate(visible('.writing-state[role=status]')), false, 'No-JS Writing must not promise an ongoing feed load');
                    assert.equal(await page.evaluate(visible('.writing-link[href="https://medium.hmazharul.com/"]')), true, 'The ordinary Medium archive must remain available');
                }
                result.destinations.push(route);
            }
            await page.go('/home/', false);
            assert.equal(await page.evaluate(visible('.preloader')), false, 'No-JS Home must not be covered by the preloader');
            assert.equal(await page.evaluate('document.querySelectorAll(".research-figure img").length'), 5);
            const screenshot = await page.send('Page.captureScreenshot', { format: 'png' });
            await writeFile(join(directory, `no-js-home-${width}.png`), Buffer.from(screenshot.data, 'base64'));
            result.passed = true;
        } finally {
            try { await writeFile(join(directory, `no-js-${width}.json`), JSON.stringify(result, null, 2)); }
            finally { try { await page?.close(); } finally { await server.close(); } }
        }
    });
}
