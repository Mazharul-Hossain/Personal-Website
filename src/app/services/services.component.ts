import { Component, OnInit } from '@angular/core';
declare var jQuery: any;

import * as $ from 'jquery';
import 'magnific-popup';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // ===== Magnific Popup
    $('.image-popup').magnificPopup({
      type: 'image',
      gallery: {
        enabled: true
      }
    });
  }

}
