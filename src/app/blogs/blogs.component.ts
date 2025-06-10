import { Component, Inject } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WindowRef } from '../shared/window.token';

@Component({
    selector: 'app-blogs',
    templateUrl: './blogs.component.html',
    styleUrl: './blogs.component.css',
    standalone: false
})
export class BlogsComponent {

    // This service can now make HTTP requests via `this.http`.
    private http = inject(HttpClient);
    // private proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    // private rssUrl = "https://medium.com/feed/@hossain.mazharul";
    private rssUrl = "/feed";

    constructor(@Inject(WindowRef) private windowRef: any
    ) { }

    ngAfterViewInit() {
        const winRef = this.windowRef.nativeWindow();

        if (winRef) {
            //We loading the script on after view is loaded
            // this.loadScripts();

            // Fetch RSS feed
            this.fetchRSSFeed(this.rssUrl).then(items => {
                this.populateRSSFeed(items);
            }).catch(error => {
                console.error('Error in ngAfterViewInit while fetching RSS feed:', error);
            });
        }
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
            // Now the response is JSON, not XML
            const items = await fetch(url)
                .then(res => {
                    return res.json();
                });
            // items is already an array of blog post objects
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
                            <h6 class="card-subtitle mb-2 text-muted">${item['dc:creator']}</h6>
                            <p class="card-text">${item['content:encoded']}</p>
                            <a href="${item.link}" class="card-link" target="_blank">Read more</a>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        }
    }

}
