import { Component } from '@angular/core';
import $ from 'jquery';

@Component({
    selector: 'app-nav-footer',
    templateUrl: './nav-footer.component.html',
    styleUrls: ['./nav-footer.component.css'],
    standalone: false
})
export class NavFooterComponent {

    constructor() {
    }

    ngAfterViewInit(): void {
        // ===== Back to top
        // Show or hide the sticky footer button
        $(window).on('scroll', function (event): void {
            if ($(this).scrollTop() > 600) {
                $('.back-to-top').fadeIn(200);
            } else {
                $('.back-to-top').fadeOut(200);
            }
        });

        // Animate the scroll to yop
        // tslint:disable-next-line:only-arrow-functions
        $('.back-to-top').on('click', function (event): void {
            event.preventDefault();

            $('html, body').animate({
                scrollTop: 0,
            }, 1500);
        });
    }

}
