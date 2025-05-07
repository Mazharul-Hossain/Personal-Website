import { Component, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
    standalone: false
})
export class NavBarComponent implements OnDestroy {

    private pageScrollLinks = document.getElementsByClassName('page-scroll');
    private activeRoute: string | null = null; // Track the active route
    private routerSubscription: Subscription;

    constructor(private router: Router, private location: Location) {
        this.routerSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.activeRoute = event.urlAfterRedirects; // Update based on the current route

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
    }

    ngAfterViewInit(): void {
        // ===== Mobile Menu
        document.querySelector('.navbar-toggler')?.addEventListener('click', function (): void {
            this.classList.toggle('active');
        });

        document.querySelectorAll('.navbar-nav a').forEach(anchor => {
            anchor.addEventListener('click', () => {
                document.querySelector('.navbar-toggler')?.classList.remove('active');
                document.querySelector('.navbar-collapse')?.classList.remove('show');
            });
        });
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

                console.log(sectionTop, scrollPosition, sectionBottom)

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
            section.scrollIntoView({ behavior: 'smooth' });
            // Update the URL with the section ID
            this.location.replaceState(`#${sectionId}`);
        } else {
            // Navigate to the route if the section is not on the current page
            this.router.navigate([`/${sectionId}`]);
        }
    }
}
