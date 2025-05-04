import {Component, OnInit, AfterViewInit} from '@angular/core';
import $ from 'jquery';

declare var Parallax: any;

@Component({
    selector: 'app-index-page',
    templateUrl: './index-page.component.html',
    styleUrls: ['./index-page.component.css'],
    standalone: false
})
export class IndexPageComponent implements OnInit, AfterViewInit {

  constructor() {
  }

  ngOnInit(): void {
    // tslint:disable-next-line:only-arrow-functions
    $(window).on('load', function (event): void {
      $('.preloader').delay(200).fadeOut(300);
    });
  }

  ngOnLoad(): void {
  }

  ngAfterViewInit(): void {
    if ($('#parallax').length) {
      const scene = document.getElementById('parallax');
      const parallax = new Parallax(scene);
    }
  }
}
