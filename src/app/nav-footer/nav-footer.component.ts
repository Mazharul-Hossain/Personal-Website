import { Component, Renderer2, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { WindowRef } from '../shared/window.token';

@Component({
    selector: 'app-nav-footer',
    templateUrl: './nav-footer.component.html',
    styleUrls: ['./nav-footer.component.css'],
    standalone: false
})
export class NavFooterComponent implements AfterViewInit {

    constructor(
        private renderer: Renderer2,
        private el: ElementRef,
        @Inject(WindowRef) private windowRef: any
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
        this.renderer.listen(window, 'scroll', () => {
            if ((window.scrollY || 0) > 400) {
                this.renderer.setStyle(backToTopButton, 'display', 'block');
                this.renderer.setStyle(backToTopButton, 'opacity', '1');
                this.renderer.setStyle(backToTopButton, 'transition', 'opacity 0.2s');
            } else {
                this.renderer.setStyle(backToTopButton, 'opacity', '0');
                this.renderer.setStyle(backToTopButton, 'transition', 'opacity 0.2s');
                setTimeout(() => {
                    this.renderer.setStyle(backToTopButton, 'display', 'none');
                }, 200);
            }
        });

        // Animate the scroll to top
        this.renderer.listen(backToTopButton, 'click', (event: Event) => {
            event.preventDefault();

            // Custom smooth scrolling
            const targetPosition = 0;
            const startPosition = window.scrollY || 0;
            const distance = targetPosition - startPosition;
            const duration = 1500; // Duration in milliseconds
            let startTime: number | null = null;

            const scrollAnimation = (currentTime: number) => {
                if (!startTime) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(scrollAnimation);
            };

            const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
                t /= d / 2;
                if (t < 1) return (c / 2) * t * t + b;
                t--;
                return (-c / 2) * (t * (t - 2) - 1) + b;
            };

            requestAnimationFrame(scrollAnimation);
        });
    }
}
