/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Implementation: src/app/home/selected-research/selected-research.component.ts */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { WindowRef } from '../../shared/window.token';

import { SelectedResearchComponent } from './selected-research.component';
import { RESEARCH_CAPTION_BASELINE, RESEARCH_LINK_BASELINE } from "../../publications/publication-inventory.fixture";

describe('SelectedResearchComponent', () => {
    let fixture: ComponentFixture<SelectedResearchComponent>;
    let overlayContainer: OverlayContainer;
    let container: HTMLElement;
    let opening: jasmine.Spy;
    const openers = () => Array.from(fixture.nativeElement.querySelectorAll('button.research-image-preview')) as HTMLButtonElement[];
    const open = async (index = 0) => {
        const opener = openers()[index];
        expect(opener).withContext('Each research image needs a native popup opener').toBeDefined();
        if (!opener) throw new Error('Missing research image opener');
        opener.click();
        await opening.calls.mostRecent().returnValue;
        await fixture.whenStable();
        fixture.detectChanges();
        return opener;
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SelectedResearchComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SelectedResearchComponent);
        opening = spyOn(fixture.componentInstance, 'openImagePopup').and.callThrough();
        overlayContainer = TestBed.inject(OverlayContainer);
        container = overlayContainer.getContainerElement();
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        overlayContainer.ngOnDestroy();
    });

    it('opens every research image with its original alternative text and attribution', async () => {
        const figures = fixture.componentInstance.studies.flatMap(study => study.figures).filter(figure => figure.src);
        expect(openers().length).toBe(figures.length);
        for (const [index, figure] of figures.entries()) {
            const opener = await open(index);
            expect(opener.type).toBe('button');
            expect(opener.getAttribute('aria-label')).toContain(figure.alt!);
            const dialog = container.querySelector('[role="dialog"]')!;
            expect(dialog.getAttribute('aria-modal')).toBe('true');
            expect(dialog.getAttribute('aria-label')).toContain(figure.alt!);
            expect(dialog.querySelector('img')?.getAttribute('src')).toBe(figure.src);
            expect(dialog.querySelector('img')?.getAttribute('alt')).toBe(figure.alt);
            expect(dialog.querySelector('figcaption')?.textContent?.trim()).toBe(figure.caption);
            const close = dialog.querySelector<HTMLButtonElement>('.popup-close')!;
            expect(document.activeElement).toBe(close);
            close.click();
            expect(document.activeElement).toBe(opener);
            expect(container.querySelector('[role="dialog"]')).toBeNull();
        }
    });

    it('traps focus and dismisses with Escape or the backdrop without stale overlays', async () => {
        const opener = await open(1);
        const close = container.querySelector('.popup-close');
        const anchors = Array.from(container.querySelectorAll<HTMLElement>('.cdk-focus-trap-anchor'));
        expect(anchors.length).toBe(2);
        for (const anchor of anchors) {
            anchor.focus();
            expect(document.activeElement).toBe(close);
        }
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        expect(container.querySelector('[role="dialog"]')).toBeNull();
        expect(document.activeElement).toBe(opener);
        await open(2);
        container.querySelector<HTMLElement>('.cdk-overlay-backdrop')!.click();
        expect(container.querySelector('[role="dialog"]')).toBeNull();
        expect(document.activeElement).toBe(openers()[2]);
    });

    it('disposes owned overlay and focus anchors on destruction without restoring departing focus', async () => {
        const opener = await open();
        const focus = spyOn(opener, 'focus');
        fixture.destroy();
        expect(container.querySelector('.cdk-overlay-pane, .cdk-overlay-backdrop, .cdk-focus-trap-anchor')).toBeNull();
        expect(focus).not.toHaveBeenCalled();
    });

    it('ignores a pending popup after its view is destroyed', async () => {
        const opener = openers()[0];
        expect(opener).toBeDefined();
        if (!opener) throw new Error('Missing research image opener');
        opener.click();
        fixture.destroy();
        await opening.calls.mostRecent().returnValue;
        expect(container.querySelector('.cdk-overlay-pane')).toBeNull();
    });

    it('does not open an overlay when the browser window is unavailable', async () => {
        spyOn(TestBed.inject(WindowRef), 'nativeWindow').and.returnValue(undefined);
        await open();
        expect(container.querySelector('.cdk-overlay-pane')).toBeNull();
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
