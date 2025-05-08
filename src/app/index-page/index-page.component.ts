import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';

declare var Parallax: any;

@Component({
    selector: 'app-index-page',
    templateUrl: './index-page.component.html',
    styleUrls: ['./index-page.component.css'],
    standalone: false
})
export class IndexPageComponent implements OnInit, AfterViewInit {

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit(): void {
        const preloader = this.elementRef.nativeElement.querySelector('.preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.transition = 'opacity 0.5s';
                preloader.style.opacity = '0';
                setTimeout(() => preloader.style.display = 'none', 500);
            }, 200);
        }
    }

    ngOnLoad(): void {
    }

    ngAfterViewInit(): void {
        const parallaxElement = this.elementRef.nativeElement.querySelector('#parallax');
        if (parallaxElement) {
            const parallax = new Parallax(parallaxElement);
        }
    }
}
