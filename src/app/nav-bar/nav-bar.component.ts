import { AfterViewInit, ChangeDetectionStrategy, Component, HostListener, Inject, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
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
export class NavBarComponent implements AfterViewInit, OnDestroy {
    navbarOpen = false;

    // private activeRoute: string | null; // Track the active route
    private routerSubscription?: Subscription;
    private winRef: Window | undefined;

    constructor(
        private router: Router,
        private location: Location,
        @Inject(WindowRef) private windowRef: any,
        private scrollAnimation: ScrollAnimationService
    ) {
        this.winRef = this.windowRef.nativeWindow();
    }

    toggleNavbar() {
        this.navbarOpen = !this.navbarOpen;
    }

    closeNavbar() {
        this.navbarOpen = false;
    }

    ngAfterViewInit(): void {
        // Only add scroll listener if windowRef is defined
        if (!this.winRef) {
            return;
        }
        this.routerSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                // // Update based on the current route
                // this.activeRoute = event.urlAfterRedirects;

                const currentPath = this.location.path();
                this.pageScrollLinks().forEach((link) => {
                    const sectionId = (link as HTMLElement).dataset.customId;
                    const navItem = link.parentElement;
                    if (sectionId && navItem && currentPath.endsWith(sectionId)) {
                        navItem.classList.add('active');
                        this.removeActiveFromSiblings(navItem);
                    }
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.scrollAnimation.cancel();
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
    }

    @HostListener('window:scroll', [])
    onWindowScroll(): void {
        if (!this.winRef) return;
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;

        this.pageScrollLinks().forEach((link) => {
            const sectionId = (link as HTMLElement).dataset.customId;
            if (!sectionId) {
                return;
            }
            const section = document.getElementById(sectionId);
            const navItem = link.parentElement;

            if (section && navItem) {
                const sectionTop = section.getBoundingClientRect().top + window.scrollY - 200;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (sectionTop <= scrollPosition && scrollPosition <= sectionBottom) {
                    navItem.classList.add('active');
                    this.removeActiveFromSiblings(navItem);
                }
            }
        });

        const navigationElement = document.querySelector('.navigation');

        if (navigationElement) {
            if (scrollPosition < 10) {
                navigationElement.classList.remove('sticky');
            } else {
                navigationElement.classList.add('sticky');
            }
        }
    }

    private removeActiveFromSiblings(activeElement: HTMLElement): void {
        const siblings = Array.from(activeElement.parentElement?.children || []);
        siblings.forEach((sibling: Element) => {
            if (sibling !== activeElement) {
                sibling.classList.remove('active');
                sibling.querySelector('a')?.removeAttribute('aria-current');
            }
        });
        activeElement.querySelector('a')?.setAttribute('aria-current', 'location');
    }

    private pageScrollLinks(): Element[] {
        return Array.from(document.getElementsByClassName('page-scroll'));
    }

    navigateToSection(sectionId: string, animate = true): void {
        if (!this.winRef) return;
        this.scrollAnimation.cancel();
        const section = document.getElementById(sectionId);
        if (section) {
            // Scroll to the section if it exists on the current page
            // section.scrollIntoView({ behavior: 'smooth' });

            // Custom smooth scrolling
            const expandedMenuHeight = document.querySelector('.navbar-collapse.show')?.getBoundingClientRect().height || 0;
            const headerHeight = (document.querySelector('.navigation')?.getBoundingClientRect().height || 0) - expandedMenuHeight;
            const targetPosition = Math.max(0, section.getBoundingClientRect().top + window.scrollY - headerHeight - 16);
            if (!animate) {
                window.scrollTo({ top: targetPosition, behavior: 'instant' });
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
