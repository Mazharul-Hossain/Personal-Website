import { Component, OnInit, AfterViewInit, ElementRef, Inject } from '@angular/core';
import { WindowRef } from '../shared/window.token';
declare var Parallax: any;

@Component({
    selector: 'app-index-page',
    templateUrl: './index-page.component.html',
    styleUrls: ['./index-page.component.css'],
    standalone: false
})
export class IndexPageComponent implements OnInit, AfterViewInit {
    private winRef: Window | undefined;

    constructor(
        private elementRef: ElementRef,
        @Inject(WindowRef) private windowRef: any
    ) {
        this.winRef = this.windowRef.nativeWindow();
    }

    ngOnInit(): void {
        if (this.winRef) {
            const preloader = this.elementRef.nativeElement.querySelector('.preloader');
            if (preloader) {
                setTimeout(() => {
                    preloader.style.transition = 'opacity 0.5s';
                    preloader.style.opacity = '0';
                    setTimeout(() => preloader.style.display = 'none', 500);
                }, 200);
            }
        }
    }

    ngOnLoad(): void {
    }

    ngAfterViewInit(): void {
        if (this.winRef) {
            const parallaxElement = this.elementRef.nativeElement.querySelector('#parallax');
            if (parallaxElement) {
                const parallax = new Parallax(parallaxElement);
            }
        }
    }
}
