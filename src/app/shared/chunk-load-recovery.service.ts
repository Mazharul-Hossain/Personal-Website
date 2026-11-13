/* @agent Read: .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/BUNDLE_OPTIMIZATION_PLAN.md
Consumer: src/app/app.component.ts; Tests: src/app/shared/chunk-load-recovery.service.spec.ts
Production integration: tests/service-worker/service-worker.test.mjs */
import { Injectable, inject } from '@angular/core';
import { WindowRef } from './window.token';

const RELOAD_KEY = 'portfolio.chunk-reload-at';
const COOLDOWN_MS = 5 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class ChunkLoadRecoveryService {
    private readonly windowRef = inject(WindowRef);
    private attempted = false;

    tryReload(url: string, error: unknown): boolean {
        const chunkFailure = error instanceof Error && (
            (error.name === 'TypeError' && /^(Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed)(:|\.|$)/i.test(error.message)) ||
            (error.name === 'ChunkLoadError' && /Loading chunk .+ failed/i.test(error.message))
        );
        if (!chunkFailure || this.attempted) return false;
        const browser = this.windowRef.nativeWindow();
        if (!browser || browser.navigator.onLine === false) return false;
        try {
            const current = new URL(browser.location.href);
            const target = new URL(url, current);
            if (target.origin !== current.origin || !['http:', 'https:'].includes(target.protocol)) return false;
            const storage = browser.sessionStorage;
            const previous = storage.getItem(RELOAD_KEY);
            const now = Date.now();
            if (previous !== null) {
                const at = Number(previous);
                if (!Number.isFinite(at) || now - at < COOLDOWN_MS) return false;
            }
            // Persist before leaving this document; a broken next build must not create a reload loop.
            storage.setItem(RELOAD_KEY, String(now));
            this.attempted = true;
            if (target.pathname === current.pathname && target.search === current.search) {
                // Assigning a same-path fragment can stay in this document, leaving failed imports cached.
                browser.history.replaceState(browser.history.state, '', target.href);
                browser.location.reload();
            } else {
                browser.location.assign(target.href);
            }
            return true;
        } catch {
            // Without durable per-tab storage we cannot safely bound a cross-document retry.
            return false;
        }
    }
}
