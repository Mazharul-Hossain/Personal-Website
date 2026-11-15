/* @agent Read: .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Template: src/app/nav-bar/nav-bar.component.html; Styles: src/app/nav-bar/nav-bar.component.css */
import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT, Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { WindowRef } from '../shared/window.token';
import { ScrollAnimationService } from '../shared/scroll-animation.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NavBarComponent implements OnInit, AfterViewInit, OnDestroy {
    navbarOpen = false;
    activeSection = 'home';
    readonly navigationItems = [
        { id: 'home', label: 'Home' },
        { id: 'research', label: 'Research' },
        { id: 'publications', label: 'Publications' },
        { id: 'experience', label: 'Experience' },
        { id: 'about', label: 'About' },
        { id: 'blog', label: 'Writing' },
        { id: 'contact', label: 'Contact' }
    ];

    private routerSubscription?: Subscription;
    private unlistenScroll?: () => void;
    private readonly winRef: Window | undefined;

    constructor(
        private router: Router,
        private location: Location,
        @Inject(WindowRef) private windowRef: WindowRef,
        private scrollAnimation: ScrollAnimationService,
        @Inject(DOCUMENT) private readonly document: Document,
        private readonly renderer: Renderer2
    ) {
        this.winRef = this.windowRef.nativeWindow();
    }

    toggleNavbar() {
        this.navbarOpen = !this.navbarOpen;
    }

    closeNavbar() {
        this.navbarOpen = false;
    }

    navigateFromLink(event: MouseEvent, sectionId: string): void {
        // Ordinary links retain browser new-tab/window behavior and remain useful without JS.
        if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        this.navigateToSection(sectionId);
        this.closeNavbar();
    }

    ngOnInit(): void {
        // Bind route state before rendering, including when prerendering without a browser.
        this.updateActiveRoute(this.location.path());
        this.routerSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) this.updateActiveRoute(event.urlAfterRedirects);
        });
    }

    ngAfterViewInit(): void {
        if (this.winRef) this.unlistenScroll = this.renderer.listen(this.winRef, 'scroll', () => this.onWindowScroll());
    }

    ngOnDestroy(): void {
        this.scrollAnimation.cancel();
        this.unlistenScroll?.();
        this.unlistenScroll = undefined;
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
    }

    onWindowScroll(): void {
        const browser = this.winRef;
        if (!browser) return;
        const scrollPosition = browser.scrollY || this.document.documentElement.scrollTop;

        this.pageScrollLinks().forEach((link) => {
            const sectionId = link.dataset.customId;
            if (!sectionId) {
                return;
            }
            const section = this.document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.getBoundingClientRect().top + browser.scrollY - 200;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (sectionTop <= scrollPosition && scrollPosition <= sectionBottom) {
                    this.activeSection = sectionId;
                }
            }
        });

        const navigationElement = this.document.querySelector('.navigation');

        if (navigationElement) {
            if (scrollPosition < 10) {
                navigationElement.classList.remove('sticky');
            } else {
                navigationElement.classList.add('sticky');
            }
        }
    }

    private updateActiveRoute(url: string): void {
        const path = url.split(/[?#]/)[0].replace(/\/$/, '');
        const sectionId = path ? path.slice(1) : 'home';
        this.activeSection = this.navigationItems.some(item => item.id === sectionId) ? sectionId : '';
    }

    private pageScrollLinks(): HTMLAnchorElement[] {
        return Array.from(this.document.querySelectorAll<HTMLAnchorElement>('.page-scroll'));
    }

    navigateToSection(sectionId: string, animate = true): void {
        const browser = this.winRef;
        if (!browser) return;
        this.scrollAnimation.cancel();
        const section = this.document.getElementById(sectionId);
        if (section) {
            // The mobile menu is absolute, so its height is outside the fixed header's layout.
            const headerHeight = this.document.querySelector('.navigation')?.getBoundingClientRect().height || 0;
            const targetPosition = Math.max(0, section.getBoundingClientRect().top + browser.scrollY - headerHeight - 16);
            if (!animate) {
                browser.scrollTo({ top: targetPosition, behavior: 'instant' });
            } else {
                this.scrollAnimation.scrollTo(targetPosition, 1000);
            }

            // Update the URL with the section ID
            this.location.replaceState(`${sectionId}`);
        } else {
            // Navigate to the route if the section is not on the current page
            this.router.navigate([`/${sectionId}`]);
        }
    }
}
