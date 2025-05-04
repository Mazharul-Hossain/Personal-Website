import {Component, OnInit} from '@angular/core';

declare var jQuery: any;
declare var Parallax: any;

import $ from 'jquery';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
    standalone: false
})
export class NavBarComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    // ===== Mobile Menu
    $('.navbar-toggler').on('click', function(): void {
      $(this).toggleClass('active');
    });

    // tslint:disable-next-line:only-arrow-functions
    $('.navbar-nav a').on('click', function(): void {
      $('.navbar-toggler').removeClass('active');
    });

    // ===== close navbar-collapse when a  clicked
    // tslint:disable-next-line:only-arrow-functions
    $('.navbar-nav a').on('click', function(): void {
      $('.navbar-collapse').removeClass('show');
    });

    // ===== Sticky
    // tslint:disable-next-line:only-arrow-functions
    $(window).on('scroll', function(event): void {
      const scroll = $(window).scrollTop();
      if (scroll < 10) {
        $('.navigation').removeClass('sticky');
      } else {
        $('.navigation').addClass('sticky');
      }
    });

    // ===== Section Menu Active
    const scrollLink = $('.page-scroll');
    // Active link switching
    $(window).scroll(function(): void {
      const scrollbarLocation = $(this).scrollTop();

      scrollLink.each(function(): void {

        const sectionOffset = $(this.hash).offset().top - 200;

        if (sectionOffset <= scrollbarLocation) {
          $(this).parent().addClass('active');
          $(this).parent().siblings().removeClass('active');
        }
      });
    });
  }
}
