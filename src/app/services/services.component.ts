declare const require: any;

import { Component, OnInit } from '@angular/core';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var jQuery: any;

import $ from 'jquery';
import 'magnific-popup';

@Component({
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.css'],
    standalone: false
})
export class ServicesComponent implements OnInit {

    // This service can now make HTTP requests via `this.http`.
    private http = inject(HttpClient); 
    private url = 'https://medium.hmazharul.com/feed';

    constructor() {}

    ngOnInit(): void {
        // ===== Magnific Popup
        $('.image-popup').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true
            }
        });
    }

    ngAfterViewInit() {
        //We loading the script on after view is loaded
        this.loadScripts();

        // Fetch RSS feed
        this.fetchRSSFeed(this.url).then(items => {
            this.populateRSSFeed(items);
        }).catch(error => {
            console.error('Error in ngAfterViewInit while fetching RSS feed:', error);
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
            node.async = true;
            document.getElementsByTagName('body')[0].appendChild(node);
        }
    }

    async fetchRSSFeed(url: string): Promise<any[]> {
        try {
            const response = await this.http.get(url, { responseType: 'text' }).toPromise();
            const parser = new DOMParser();
            const xml = parser.parseFromString(response, 'application/xml');
            const items = Array.from(xml.querySelectorAll('item')).map(item => {
                return {
                    title: item.querySelector('title')?.textContent || '',
                    creator: item.querySelector('dc:creator')?.textContent || '',
                    link: item.querySelector('link')?.textContent || '',
                    description: item.querySelector('content:encoded')?.textContent || ''
                };
            });
            return items;
        } catch (error) {
            console.error('Error fetching RSS feed:', error);
            return [];
        }
    }

    populateRSSFeed(items: any[]): void {
        const container = document.getElementById('medium-rss');
        if (container) {
            container.innerHTML = ''; // Clear existing content
            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'col-lg-4 col-md-6 col-sm-12';
                card.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${item.creator}</h6>
                            <p class="card-text">${item.description}</p>
                            <a href="${item.link}" class="card-link" target="_blank">Read more</a>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        }
    }
}
