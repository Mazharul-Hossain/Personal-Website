/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Implementation: src/app/home/selected-research/selected-research.component.ts */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedResearchComponent } from './selected-research.component';
import { RESEARCH_CAPTION_BASELINE, RESEARCH_LINK_BASELINE } from "../../publications/publication-inventory.fixture";

describe('SelectedResearchComponent', () => {
    let fixture: ComponentFixture<SelectedResearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SelectedResearchComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SelectedResearchComponent);
        fixture.detectChanges();
    });

    it('renders three studies with image arrays', () => {
        const element: HTMLElement = fixture.nativeElement;
        expect(element.querySelectorAll('.research-study').length).toBe(3);
        expect(element.querySelectorAll('.research-figure img').length).toBe(4);
    });

    it("offers lossless WebP figures while retaining original PNG fallbacks and alternative text", () => {
        const pictures = Array.from(fixture.nativeElement.querySelectorAll("picture")) as HTMLPictureElement[];
        expect(pictures.length).toBe(2);
        for (const picture of pictures) {
            const source = picture.querySelector("source");
            const fallback = picture.querySelector("img");
            expect(source?.type).toBe("image/webp");
            expect(source?.getAttribute("srcset")).toMatch(/\.webp$/);
            expect(fallback?.getAttribute("src")).toMatch(/\.png$/);
            expect(fallback?.getAttribute("alt")?.length).toBeGreaterThan(0);
        }
    });

    it("preserves all research resources and complete figure attribution", () => {
        const element: HTMLElement = fixture.nativeElement;
        expect(fixture.componentInstance.studies.flatMap(study => study.links.map(link => ({ label: link.label, url: link.href }))))
            .toEqual([...RESEARCH_LINK_BASELINE]);
        expect(Array.from(element.querySelectorAll("figcaption")).map(caption => caption.textContent?.trim()))
            .toEqual([...RESEARCH_CAPTION_BASELINE]);
        expect(element.querySelectorAll("a[data-publication-id]").length).toBe(7);
        expect(element.querySelector('a[href="https://arxiv.org/abs/2408.07114"]')?.hasAttribute("data-publication-id")).toBeFalse();
    });
});
