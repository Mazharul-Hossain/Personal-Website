/* @agent Read: .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Template: src/app/app.component.html; Styles: src/app/app.component.css */
// TODO<Bug>[BUG-05]: reproduce fragment scrolling versus route scroll-to-top before changing navigation; see docs/BUNDLE_OPTIMIZATION_PLAN.md.
import { Component, OnInit, OnDestroy, Inject, ElementRef, isDevMode, ChangeDetectionStrategy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GtagService } from './gtag/gtag.service';
import { WindowRef } from './shared/window.token';
import { PageMetadataService } from './shared/page-metadata.service';

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
        private router: Router,
        private pageMetadata: PageMetadataService
    ) { }

    ngOnInit(): void {
        if (!isDevMode()) {
            this.elementRef.nativeElement.removeAttribute("ng-version");
        }

        const browserWindow = this.windowRef.nativeWindow();
        this.pageMetadata.update(this.router.url);
        if (browserWindow) {
            this.gtagService.addGtagScript();
        }
        this.routerSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.pageMetadata.update(event.urlAfterRedirects);
                browserWindow?.requestAnimationFrame(() => browserWindow.scrollTo(0, 0));
            }
        });
    }

    ngOnDestroy(): void {
        this.routerSubscription?.unsubscribe();
    }
}
