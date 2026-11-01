import { TestBed } from "@angular/core/testing";
import { DOCUMENT } from "@angular/common";
import { Title } from "@angular/platform-browser";
import { PageMetadataService } from "./page-metadata.service";

describe("PageMetadataService", () => {
    it("updates the canonical and title when moving between standalone pages", () => {
        const service = TestBed.inject(PageMetadataService);
        const document = TestBed.inject(DOCUMENT);
        service.update("/blog?source=test");
        expect(TestBed.inject(Title).getTitle()).toBe("Writing | Mazharul Hossain");
        expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://www.hmazharul.com/blog");
        service.update("/experience");
        expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://www.hmazharul.com/experience");
        expect(document.querySelectorAll('meta[name="description"]').length).toBe(1);
    });
});
