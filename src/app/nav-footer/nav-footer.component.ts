/* @agent Read: .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Template: src/app/nav-footer/nav-footer.component.html; Styles: src/app/nav-footer/nav-footer.component.css */
// TODO<Migration>[MIG-02]: migrate guarded global browser access without changing scrolling; see docs/BUNDLE_OPTIMIZATION_PLAN.md.
import { Component, Renderer2, ElementRef, AfterViewInit, OnDestroy, Inject, ChangeDetectionStrategy } from '@angular/core';
import { WindowRef } from '../shared/window.token';
import { ScrollAnimationService } from '../shared/scroll-animation.service';

@Component({
    selector: 'app-nav-footer',
    templateUrl: './nav-footer.component.html',
    styleUrls: ['./nav-footer.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NavFooterComponent implements AfterViewInit, OnDestroy {
    readonly year = new Date().getFullYear();
    private readonly unlisteners: (() => void)[] = [];
    private hideTimer?: ReturnType<typeof setTimeout>;

    constructor(
        private renderer: Renderer2,
        private el: ElementRef,
        @Inject(WindowRef) private windowRef: WindowRef,
        private scrollAnimation: ScrollAnimationService
    ) { }

    ngAfterViewInit(): void {
        const winRef = this.windowRef.nativeWindow();
        if (!winRef) {
            // windowRef is NOT available
            return;
        }
        // windowRef is available
        const backToTopButton = this.el.nativeElement.querySelector('.back-to-top');

        // Show or hide the sticky footer button
        this.unlisteners.push(this.renderer.listen(window, 'scroll', () => {
            if ((window.scrollY || 0) > 400) {
                clearTimeout(this.hideTimer);
                this.hideTimer = undefined;
                this.renderer.setStyle(backToTopButton, 'display', 'block');
                this.renderer.setStyle(backToTopButton, 'opacity', '1');
                this.renderer.setStyle(backToTopButton, 'transition', 'opacity 0.2s');
            } else {
                this.renderer.setStyle(backToTopButton, 'opacity', '0');
                this.renderer.setStyle(backToTopButton, 'transition', 'opacity 0.2s');
                if (this.hideTimer === undefined) {
                    this.hideTimer = setTimeout(() => {
                        this.renderer.setStyle(backToTopButton, 'display', 'none');
                        this.hideTimer = undefined;
                    }, 200);
                }
            }
        }));

        // Animate the scroll to top
        this.unlisteners.push(this.renderer.listen(backToTopButton, 'click', (event: Event) => {
            event.preventDefault();
            this.scrollAnimation.scrollTo(0, 1500);
        }));
    }

    ngOnDestroy(): void {
        this.unlisteners.splice(0).forEach(unlisten => unlisten());
        clearTimeout(this.hideTimer);
        this.hideTimer = undefined;
        this.scrollAnimation.cancel();
    }
}
