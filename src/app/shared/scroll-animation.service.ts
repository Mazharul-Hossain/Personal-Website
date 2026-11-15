/* @agent Read: .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Architecture and content ownership: docs/README.md */
// JS enhancement [MIG-05]: coordinate calculated offsets, explicit duration and latest-action cancellation across navigation; see docs/STYLESHEET_REFINEMENT_PLAN.md.
import { Injectable } from '@angular/core';
import { WindowRef } from './window.token';

@Injectable({ providedIn: 'root' })
export class ScrollAnimationService {
    private frame?: number;
    private generation = 0;

    get revision(): number { return this.generation; }

    constructor(private windowRef: WindowRef) {}

    cancel(): void {
        this.generation++;
        const win = this.windowRef.nativeWindow();
        if (win && this.frame !== undefined) win.cancelAnimationFrame(this.frame);
        this.frame = undefined;
    }

    scrollTo(target: number, duration: number): void {
        const win = this.windowRef.nativeWindow();
        this.cancel();
        if (!win) return;

        const generation = this.generation;

        const start = win.scrollY || 0;
        const distance = target - start;
        let startTime: number | null = null;
        const animate = (currentTime: number) => {
            if (generation !== this.generation) return;
            if (startTime === null) startTime = currentTime;
            const elapsed = Math.min(currentTime - startTime, duration);
            const progress = elapsed / duration;
            const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            win.scrollTo({ top: start + distance * eased, behavior: 'instant' });
            this.frame = elapsed < duration && generation === this.generation ? win.requestAnimationFrame(animate) : undefined;
        };
        this.frame = win.requestAnimationFrame(animate);
    }
}
