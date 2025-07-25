import { Component, HostListener, OnDestroy, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { WindowRef } from '../shared/window.token';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
    standalone: false
})
export class NavBarComponent implements OnDestroy {
    navbarOpen = false;

    private pageScrollLinks: any;
    // private activeRoute: string | null; // Track the active route
    private routerSubscription: Subscription;
    private winRef: Window | undefined;

    constructor(
        private router: Router,
        private location: Location,
        @Inject(WindowRef) private windowRef: any
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
        this.pageScrollLinks = document.getElementsByClassName('page-scroll');
        this.routerSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                // // Update based on the current route
                // this.activeRoute = event.urlAfterRedirects;

                const currentPath = this.location.path();
                Array.from(this.pageScrollLinks).forEach((link: Element) => {
                    const sectionId = (link as HTMLElement).dataset.customId;
                    if (currentPath.endsWith(sectionId)) {
                        link.parentElement.classList.add('active');
                        this.removeActiveFromSiblings(link.parentElement);
                    }
                });
            }
        });

        // Remove all direct DOM event listeners for toggler and nav links!
        // window.addEventListener('scroll', ...) is fine if you need it.
        window.addEventListener('scroll', () => this.onWindowScroll());
    }

    ngOnDestroy(): void {
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
    }

    @HostListener('window:scroll', [])
    onWindowScroll(): void {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;

        Array.from(this.pageScrollLinks).forEach((link: Element) => {
            const sectionId = (link as HTMLElement).dataset.customId;
            const section = document.getElementById(sectionId);

            if (section) {
                const sectionTop = section.getBoundingClientRect().top + window.scrollY - 200;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (sectionTop <= scrollPosition && scrollPosition <= sectionBottom) {
                    link.parentElement.classList.add('active');
                    this.removeActiveFromSiblings(link.parentElement);
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
            }
        });
    }

    navigateToSection(sectionId: string): void {
        const section = document.getElementById(sectionId);
        if (section) {
            // Scroll to the section if it exists on the current page
            // section.scrollIntoView({ behavior: 'smooth' });

            // Custom smooth scrolling
            const targetPosition = section.getBoundingClientRect().top + (window.scrollY || 0);
            const startPosition = window.scrollY || 0;
            const distance = targetPosition - startPosition;
            const duration = 1000; // Duration in milliseconds
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

            // Update the URL with the section ID
            this.location.replaceState(`${sectionId}`);
        } else {
            // Navigate to the route if the section is not on the current page
            this.router.navigate([`/${sectionId}`]);
        }
    }
}
