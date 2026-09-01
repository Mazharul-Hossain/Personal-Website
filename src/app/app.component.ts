import { Component, OnInit, OnDestroy, Inject, ElementRef, isDevMode, ChangeDetectionStrategy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GtagService } from './gtag/gtag.service';
import { WindowRef } from './shared/window.token';

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

    constructor(
        private elementRef: ElementRef,
        private gtagService: GtagService,
        @Inject(WindowRef) private windowRef: WindowRef,
        private router: Router
    ) { }

    ngOnInit(): void {
        if (!isDevMode()) {
            this.elementRef.nativeElement.removeAttribute("ng-version");
        }

        const browserWindow = this.windowRef.nativeWindow();
        if (browserWindow) {
            this.gtagService.addGtagScript();
            this.routerSubscription = this.router.events.subscribe(event => {
                if (event instanceof NavigationEnd) {
                    browserWindow.requestAnimationFrame(() => browserWindow.scrollTo(0, 0));
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.routerSubscription?.unsubscribe();
    }
}
