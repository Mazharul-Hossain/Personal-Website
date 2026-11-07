/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Implementation: src/app/publications/publications.component.ts */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationsComponent } from './publications.component';
import { PUBLICATION_BASELINE } from "./publication-inventory.fixture";

describe('PublicationsComponent', () => {
  let component: PublicationsComponent;
  let fixture: ComponentFixture<PublicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the publication heading and Scholar link', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('h2')?.textContent).toContain('My Research Publications');
    expect(element.querySelector('a[href*="scholar.google.com"]')).not.toBeNull();
  });

  it("preserves every original citation, resource target and category order", () => {
    const element: HTMLElement = fixture.nativeElement;
    const entries = Array.from(element.querySelectorAll("#journal li, #conference li, #thesis li"));
    expect(entries.length).toBe(PUBLICATION_BASELINE.length);
    expect(element.querySelectorAll("#journal li b, #conference li b, #thesis li b").length).toBe(14);
    const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
    PUBLICATION_BASELINE.forEach((expected, index) => {
      const entry = entries[index];
      expect(entry.closest(".row")?.id).toBe(expected.category);
      expect(normalize(entry.textContent || "")).withContext(expected.proposedId).toBe(expected.text);
      expect(Array.from(entry.querySelectorAll("a")).map(link => ({
        label: normalize(link.textContent || ""), url: link.getAttribute("href"), target: link.getAttribute("target")
      }))).withContext(expected.proposedId).toEqual([...expected.links]);
    });
  });

  it("identifies all citations by stable publication IDs", () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(Array.from(element.querySelectorAll("li[data-publication-id]")).map(entry =>
      entry.getAttribute("data-publication-id")
    )).toEqual(PUBLICATION_BASELINE.map(entry => entry.proposedId));
  });
});
