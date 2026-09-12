import { Component, AfterViewInit, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { WindowRef } from '../shared/window.token';
interface ParallaxWindow extends Window {
    Parallax?: new (element: Element) => unknown;
}

@Component({
    selector: 'app-index-page',
    templateUrl: './index-page.component.html',
    styleUrls: ['./index-page.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class IndexPageComponent implements AfterViewInit {
    preloaderVisible = true;
    private winRef: Window | undefined;

    constructor(
        private elementRef: ElementRef,
        @Inject(WindowRef) private windowRef: any
    ) {
        this.winRef = this.windowRef.nativeWindow();
    }

    ngAfterViewInit(): void {
        if (this.winRef) {
            setTimeout(() => this.preloaderVisible = false, 500);
            const parallaxElement = this.elementRef.nativeElement.querySelector('#parallax');
            const ParallaxConstructor = (this.winRef as ParallaxWindow).Parallax;
            if (parallaxElement && ParallaxConstructor) {
                new ParallaxConstructor(parallaxElement);
            }
        }
    }
}
