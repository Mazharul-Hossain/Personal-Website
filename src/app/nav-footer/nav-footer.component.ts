import { Component, Renderer2, ElementRef, AfterViewInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { WindowRef } from '../shared/window.token';
import { ScrollAnimationService } from '../shared/scroll-animation.service';

@Component({
    selector: 'app-nav-footer',
    templateUrl: './nav-footer.component.html',
    styleUrls: ['./nav-footer.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NavFooterComponent implements AfterViewInit {
    readonly year = new Date().getFullYear();

    constructor(
        private renderer: Renderer2,
        private el: ElementRef,
        @Inject(WindowRef) private windowRef: any,
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
        let hideTimer: ReturnType<typeof setTimeout> | undefined;

        // Show or hide the sticky footer button
        this.renderer.listen(window, 'scroll', () => {
            if ((window.scrollY || 0) > 400) {
                clearTimeout(hideTimer);
                hideTimer = undefined;
                this.renderer.setStyle(backToTopButton, 'display', 'block');
                this.renderer.setStyle(backToTopButton, 'opacity', '1');
                this.renderer.setStyle(backToTopButton, 'transition', 'opacity 0.2s');
            } else {
                this.renderer.setStyle(backToTopButton, 'opacity', '0');
                this.renderer.setStyle(backToTopButton, 'transition', 'opacity 0.2s');
                if (hideTimer === undefined) {
                    hideTimer = setTimeout(() => {
                        this.renderer.setStyle(backToTopButton, 'display', 'none');
                        hideTimer = undefined;
                    }, 200);
                }
            }
        });

        // Animate the scroll to top
        this.renderer.listen(backToTopButton, 'click', (event: Event) => {
            event.preventDefault();
            this.scrollAnimation.scrollTo(0, 1500);
        });
    }
}
