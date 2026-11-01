import { Component, AfterViewInit, OnDestroy, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { WindowRef } from '../shared/window.token';
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
    preloaderVisible = true;
    private winRef: Window | undefined;
    private parallax?: { enable(): void; disable(): void };

    constructor(
        private elementRef: ElementRef,
        @Inject(WindowRef) private windowRef: any
    ) {
        this.winRef = this.windowRef.nativeWindow();
    }

    ngAfterViewInit(): void {
        if (this.winRef) {
            setTimeout(() => this.preloaderVisible = false, 500);
            const element = this.elementRef.nativeElement.querySelector('#parallax');
            const ParallaxConstructor = (this.winRef as ParallaxWindow).Parallax;
            if (element && ParallaxConstructor) this.parallax = new ParallaxConstructor(element);
        }
    }

    ngOnDestroy(): void {
        if (this.parallax) {
            // The bundled library's pending orientation check can call enable()
            // after disable(). Prevent that instance from restarting after teardown.
            this.parallax.enable = () => {};
            this.parallax.disable();
            this.parallax = undefined;
        }
    }
}
