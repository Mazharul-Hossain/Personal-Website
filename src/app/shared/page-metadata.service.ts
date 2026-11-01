import { DOCUMENT } from "@angular/common";
import { Injectable, inject } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";

@Injectable({ providedIn: "root" })
export class PageMetadataService {
    private readonly document = inject(DOCUMENT);
    private readonly meta = inject(Meta);
    private readonly title = inject(Title);

    update(url: string): void {
        const path = url.split(/[?#]/)[0].replace(/\/$/, "");
        const labels: Record<string, string> = {
            "/research": "Research", "/experience": "Experience",
            "/publications": "Publications", "/blog": "Writing", "/about": "About Me",
            "/contact": "Contact", "/work": "Projects", "/service": "Expertise", "/404": "Page Not Found"
        };
        const label = labels[path];
        const title = label ? `${label} | Mazharul Hossain` : "Mazharul Hossain | Computational Imaging & Scientific Machine Learning";
        const description = label
            ? `${label} — Mazharul Hossain's portfolio in computational imaging and scientific machine learning.`
            : "Mazharul Hossain's research in computational imaging and scientific machine learning, selected publications, professional experience, and writing.";
        // Home is an alias of the homepage.
        const canonicalUrl = `https://www.hmazharul.com${label ? path : "/"}`;
        let canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (!canonical) {
            canonical = this.document.createElement("link");
            canonical.rel = "canonical";
            this.document.head.appendChild(canonical);
        }
        canonical.href = canonicalUrl;
        this.title.setTitle(title);
        this.meta.updateTag({ name: "description", content: description });
        this.meta.updateTag({ property: "og:title", content: title });
        this.meta.updateTag({ property: "og:description", content: description });
        this.meta.updateTag({ property: "og:url", content: canonicalUrl });
        this.meta.updateTag({ name: "twitter:title", content: title });
        this.meta.updateTag({ name: "twitter:description", content: description });
        this.meta.updateTag({ name: "robots", content: path === "/404" ? "noindex" : "index, follow" });
    }
}
