import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WindowRef } from '../shared/window.token';

interface FeedItem {
    title?: string;
    link?: string;
    pubDate?: string;
    description?: string;
    'content:encoded'?: string;
}

interface WritingItem {
    title: string;
    link: string;
    date: string;
    summary: string;
}

@Component({
    selector: 'app-blogs',
    templateUrl: './blogs.component.html',
    styleUrl: './blogs.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class BlogsComponent implements AfterViewInit {
    private readonly http = inject(HttpClient);
    private readonly changeDetector = inject(ChangeDetectorRef);

    loading = true;
    posts: WritingItem[] = [];

    constructor(@Inject(WindowRef) private windowRef: WindowRef) {}

    ngAfterViewInit(): void {
        if (!this.windowRef.nativeWindow()) {
            return;
        }

        this.http.get<FeedItem[]>('/feed').subscribe({
            next: items => {
                this.posts = items.slice(0, 3).map(item => ({
                    title: item.title || 'Untitled',
                    link: item.link || 'https://medium.hmazharul.com/',
                    date: item.pubDate || '',
                    summary: this.toText(item.description || item['content:encoded'] || '')
                }));
                this.loading = false;
                this.changeDetector.markForCheck();
            },
            error: () => {
                this.loading = false;
                this.changeDetector.markForCheck();
            }
        });
    }

    private toText(value: string): string {
        const text = value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        return text.length > 180 ? `${text.slice(0, 180)}…` : text;
    }
}
