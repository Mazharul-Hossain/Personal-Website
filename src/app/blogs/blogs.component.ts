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
            // Fetch RSS feed
            this.fetchRSSFeed(this.rssUrl).then(items => {
                this.populateRSSFeed(items);
            }).catch(error => {
                console.error('Error in ngAfterViewInit while fetching RSS feed:', error);
            });
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
                            <h5 class="card-title"><a href="${item.link}" class="card-link" target="_blank">${item.title}</a></h5>
                            <h6 class="card-subtitle mb-2 text-muted">${item['dc:creator']}| ${item.pubDate}</h6>
                            <p class="card-text">${(item['content:encoded'] || '').slice(0, 300)}${(item['content:encoded'] || '').length > 300 ? '...' : ''}</p>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        }
    }

}
