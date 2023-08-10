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

    constructor() {
        this.loadScripts();
    }

    ngOnInit(): void {
        // ===== Magnific Popup
        $('.image-popup').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true
            }
        });
    }
    // Method to dynamically load JavaScript
    loadScripts() {
        // This array contains all the files/CDNs
        // https://www.geeksforgeeks.org/how-to-load-external-js-scripts-dynamically-in-angularjs/
        const dynamicScripts = [
            "assets/js/retainable-rss-embed.js"
        ];

        for (let i = 0; i < dynamicScripts.length; i++) {
            const node = document.createElement('script');
            node.src = dynamicScripts[i];
            node.type = 'text/javascript';
            node.async = false;
            document.getElementsByTagName('head')[0].appendChild(node);
        }
    }
}
