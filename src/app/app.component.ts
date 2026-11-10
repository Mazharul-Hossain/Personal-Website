/* @agent Read: .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Template: src/app/app.component.html; Styles: src/app/app.component.css */
import { ApplicationRef, Component, DOCUMENT, OnInit, OnDestroy, Inject, ElementRef, isDevMode, ChangeDetectionStrategy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GtagService } from './gtag/gtag.service';
import { WindowRef } from './shared/window.token';
import { PageMetadataService } from './shared/page-metadata.service';
import { ScrollAnimationService } from './shared/scroll-animation.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'my-app';
    private routerSubscription?: Subscription;
    private destroyed = false;
    private removeInitialScrollListener?: () => void;

    constructor(
        private elementRef: ElementRef,
        private gtagService: GtagService,
        @Inject(WindowRef) private windowRef: WindowRef,
        private router: Router,
        private pageMetadata: PageMetadataService,
        private scrollAnimation: ScrollAnimationService,
        private viewportScroller: ViewportScroller,
        private applicationRef: ApplicationRef,
        @Inject(DOCUMENT) private document: Document
    ) { }

    ngOnInit(): void {
        if (!isDevMode()) {
            this.elementRef.nativeElement.removeAttribute("ng-version");
        }

        const browserWindow = this.windowRef.nativeWindow();
        let initialScrollRevision = this.scrollAnimation.revision;
        let initialScrollPosition = this.viewportScroller.getScrollPosition();
        let viewportScrolled = false;
        this.pageMetadata.update(this.router.url);
        if (browserWindow) {
            this.gtagService.addGtagScript();
            const onInitialScroll = () => { viewportScrolled = true; };
            browserWindow.addEventListener('scroll', onInitialScroll, { passive: true });
            this.removeInitialScrollListener = () => browserWindow.removeEventListener('scroll', onInitialScroll);
            this.viewportScroller.setOffset(() => [
                0, (this.document.querySelector('.navigation')?.getBoundingClientRect().height || 0) + 16
            ]);
            // RouterScroller suppresses its initial scroll event while hydrating.
            // Restore the current anchor once hydration is stable; later scrolls belong to the router.
            void this.applicationRef.whenStable().then(() => {
                this.stopTrackingInitialScroll();
                const position = this.viewportScroller.getScrollPosition();
                // Native input does not use ScrollAnimationService; preserve it even if it returned to the start.
                if (this.destroyed || viewportScrolled || position[0] !== initialScrollPosition[0] ||
                    position[1] !== initialScrollPosition[1] || this.scrollAnimation.revision !== initialScrollRevision ||
                    !this.router.url.includes('#')) return;
                const fragment = this.router.parseUrl(this.router.url).fragment;
                if (fragment) this.viewportScroller.scrollToAnchor(fragment, { behavior: 'instant' });
            });
        }
        this.routerSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.scrollAnimation.cancel();
                initialScrollRevision = this.scrollAnimation.revision;
                initialScrollPosition = this.viewportScroller.getScrollPosition();
                viewportScrolled = false;
            }
            if (event instanceof NavigationEnd) {
                this.pageMetadata.update(event.urlAfterRedirects);
                // Hydration can suppress RouterScroller's event; ordinary routes still open at top.
                // Fragment routes are left to anchor scrolling, never reset to zero here.
                if (!this.router.parseUrl(event.urlAfterRedirects).fragment) {
                    this.viewportScroller.scrollToPosition([0, 0], { behavior: 'instant' });
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.destroyed = true;
        this.stopTrackingInitialScroll();
        this.scrollAnimation.cancel();
        this.routerSubscription?.unsubscribe();
    }

    private stopTrackingInitialScroll(): void {
        this.removeInitialScrollListener?.();
        this.removeInitialScrollListener = undefined;
    }
}
