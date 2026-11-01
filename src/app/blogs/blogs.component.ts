import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Input, inject, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timeout } from 'rxjs';
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
    private readonly destroyRef = inject(DestroyRef);
    @Input() preview = false;

    loading = true;
    posts: WritingItem[] = [];

    constructor(@Inject(WindowRef) private windowRef: WindowRef) {}

    ngAfterViewInit(): void {
        if (!this.windowRef.nativeWindow()) {
            return;
        }

        this.http.get<FeedItem[]>('/feed').pipe(
            timeout(10000),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: items => {
                const feed = Array.isArray(items) ? items : [];
                this.posts = (this.preview ? feed.slice(0, 3) : feed).map(item => ({
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
