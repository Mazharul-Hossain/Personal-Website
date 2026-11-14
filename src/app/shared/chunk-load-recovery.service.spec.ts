/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/BUNDLE_OPTIMIZATION_PLAN.md
Implementation: src/app/shared/chunk-load-recovery.service.ts */
import { TestBed } from '@angular/core/testing';
import { ChunkLoadRecoveryService } from './chunk-load-recovery.service';
import { WindowRef } from './window.token';

describe('ChunkLoadRecoveryService', () => {
    let service: ChunkLoadRecoveryService;
    let stored: Map<string, string>;
    let assign: jasmine.Spy;
    let browser: { location: { href: string; assign: jasmine.Spy; reload: jasmine.Spy }; history: { state: unknown; replaceState: jasmine.Spy }; navigator: { onLine: boolean }; sessionStorage: Pick<Storage, 'getItem' | 'setItem'> };
    beforeEach(() => {
        stored = new Map(); assign = jasmine.createSpy('assign');
        browser = { location: { href: 'https://portfolio.test/research', assign, reload: jasmine.createSpy('reload') }, history: { state: { navigationId: 1 }, replaceState: jasmine.createSpy('replaceState') }, navigator: { onLine: true }, sessionStorage: {
            getItem: key => stored.get(key) ?? null,
            setItem: (key, value) => { stored.set(key, value); }
        } };
        TestBed.configureTestingModule({ providers: [{ provide: WindowRef, useValue: { nativeWindow: () => browser } }] });
        service = TestBed.inject(ChunkLoadRecoveryService);
        spyOn(Date, 'now').and.returnValue(1_000_000);
    });
    const missingChunk = () => new TypeError('Failed to fetch dynamically imported module: https://portfolio.test/old-chunk.js');

    it('forces a document reload for a same-path fragment target instead of fragment-only navigation', () => {
        browser.location.href = 'https://portfolio.test/publications?category=journal#old';
        expect(service.tryReload('/publications?category=journal#papers', missingChunk())).toBeTrue();
        expect(browser.history.replaceState).toHaveBeenCalledOnceWith(browser.history.state, '', 'https://portfolio.test/publications?category=journal#papers');
        expect(browser.location.reload).toHaveBeenCalledTimes(1);
        expect(assign).not.toHaveBeenCalled();
    });

    it('hard-navigates to the failed route, preserving query and fragment', () => {
        expect(service.tryReload('/publications?category=journal#papers', missingChunk())).toBeTrue();
        expect(assign).toHaveBeenCalledOnceWith('https://portfolio.test/publications?category=journal#papers');
        expect(stored.size).toBe(1);
    });
    for (const message of ['error loading dynamically imported module: https://portfolio.test/old.js', 'Importing a module script failed.']) {
        it(`recognizes the browser chunk failure: ${message}`, () => {
            expect(service.tryReload('/research', new TypeError(message))).toBeTrue();
        });
    }
    it('recognizes the legacy ChunkLoadError shape', () => {
        const error = new Error('Loading chunk 9 failed.'); error.name = 'ChunkLoadError';
        expect(service.tryReload('/research', error)).toBeTrue();
    });
    it('does not reload for HTTP data failures, ordinary fetch failures, application exceptions or arbitrary values', () => {
        for (const error of [{ status: 404, message: 'Not found' }, new TypeError('Failed to fetch'), new TypeError('Cannot read properties of undefined'), new Error('Importing a module script failed.'), 'missing chunk', null]) {
            expect(service.tryReload('/blog', error)).toBeFalse();
        }
        expect(assign).not.toHaveBeenCalled(); expect(browser.location.reload).not.toHaveBeenCalled(); expect(stored.size).toBe(0);
    });
    it('does not navigate when the browser is known to be offline', () => {
        browser.navigator.onLine = false;
        expect(service.tryReload('/research', missingChunk())).toBeFalse();
        expect(assign).not.toHaveBeenCalled(); expect(browser.location.reload).not.toHaveBeenCalled(); expect(stored.size).toBe(0);
    });
    it('allows only one reload per document even after the cooldown expires', () => {
        service.tryReload('/research', missingChunk());
        (Date.now as jasmine.Spy).and.returnValue(2_000_000);
        expect(service.tryReload('/publications', missingChunk())).toBeFalse();
        expect(assign.calls.count() + browser.location.reload.calls.count()).toBe(1);
    });
    it('persists the guard across a new service/document and different failed destinations', () => {
        service.tryReload('/research', missingChunk());
        const nextDocument = TestBed.runInInjectionContext(() => new ChunkLoadRecoveryService());
        expect(nextDocument.tryReload('/publications', missingChunk())).toBeFalse();
        expect(assign.calls.count() + browser.location.reload.calls.count()).toBe(1);
    });
    it('allows a later document to recover after five minutes', () => {
        service.tryReload('/research', missingChunk());
        (Date.now as jasmine.Spy).and.returnValue(1_300_001);
        const laterDocument = TestBed.runInInjectionContext(() => new ChunkLoadRecoveryService());
        expect(laterDocument.tryReload('/publications', missingChunk())).toBeTrue();
        expect(assign.calls.count() + browser.location.reload.calls.count()).toBe(2);
    });
    it('fails closed if storage is unavailable rather than creating a reload loop', () => {
        spyOn(browser.sessionStorage, 'setItem').and.throwError('Storage disabled');
        expect(service.tryReload('/research', missingChunk())).toBeFalse(); expect(assign).not.toHaveBeenCalled(); expect(browser.location.reload).not.toHaveBeenCalled();
    });
    it('does not escape the site origin', () => {
        expect(service.tryReload('//other.test/research', missingChunk())).toBeFalse();
        expect(service.tryReload('https://other.test/research', missingChunk())).toBeFalse();
        expect(assign).not.toHaveBeenCalled(); expect(stored.size).toBe(0);
    });
    it('does nothing during server rendering', () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({ providers: [{ provide: WindowRef, useValue: { nativeWindow: () => undefined } }] });
        expect(TestBed.inject(ChunkLoadRecoveryService).tryReload('/research', missingChunk())).toBeFalse();
    });
});
