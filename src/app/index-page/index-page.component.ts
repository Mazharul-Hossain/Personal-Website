/* @agent Read: .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Template: src/app/index-page/index-page.component.html; Styles: src/app/index-page/index-page.component.css
Data: src/app/shared/social-profiles.ts */
// JS enhancement [MIG-05]: pointer/device parallax needs continuous input and physics beyond CSS; see docs/STYLESHEET_REFINEMENT_PLAN.md.
import { Component, AfterViewInit, OnDestroy, ElementRef, Inject, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { WindowRef } from '../shared/window.token';
import { HERO_SOCIAL_PROFILES } from '../shared/social-profiles';
interface ParallaxWindow extends Window {
    Parallax?: new (element: Element) => { enable(): void; disable(): void };
}

@Component({
    selector: 'app-index-page',
    templateUrl: './index-page.component.html',
    styleUrls: ['./index-page.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class IndexPageComponent implements AfterViewInit, OnDestroy {
    readonly socialProfiles = HERO_SOCIAL_PROFILES;
    preloaderVisible = true;
    private winRef: Window | undefined;
    private parallax?: { enable(): void; disable(): void };
    private preloaderTimer?: ReturnType<typeof setTimeout>;

    constructor(
        private elementRef: ElementRef,
        @Inject(WindowRef) private windowRef: WindowRef,
        private zone: NgZone
    ) {
        this.winRef = this.windowRef.nativeWindow();
    }

    ngAfterViewInit(): void {
        if (this.winRef) {
            this.preloaderTimer = setTimeout(() => {
                this.preloaderVisible = false;
                this.preloaderTimer = undefined;
            }, 500);
            const element = this.elementRef.nativeElement.querySelector('#parallax');
            const ParallaxConstructor = (this.winRef as ParallaxWindow).Parallax;
            if (element && ParallaxConstructor) {
                // Continuous decorative RAF work must not keep hydration/initial anchors unstable.
                this.parallax = this.zone.runOutsideAngular(() => new ParallaxConstructor(element));
            }
        }
    }

    ngOnDestroy(): void {
        clearTimeout(this.preloaderTimer);
        this.preloaderTimer = undefined;
        if (this.parallax) {
            // The bundled library's pending orientation check can call enable()
            // after disable(). Prevent that instance from restarting after teardown.
            this.parallax.enable = () => {};
            this.parallax.disable();
            this.parallax = undefined;
        }
    }
}
