/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Implementation: src/app/publications/selected-publications.component.ts */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { formatSelectedAuthors, SelectedPublicationsComponent } from './selected-publications.component';
import { SELECTED_PUBLICATION_BASELINE } from "./publication-inventory.fixture";

describe('SelectedPublicationsComponent', () => {
    let fixture: ComponentFixture<SelectedPublicationsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SelectedPublicationsComponent],
            imports: [RouterModule.forRoot([])]
        }).compileComponents();

        fixture = TestBed.createComponent(SelectedPublicationsComponent);
        fixture.detectChanges();
    });

    it('renders five selected publications', () => {
        expect(fixture.nativeElement.querySelectorAll('.publication-list li').length).toBe(5);
        expect(fixture.nativeElement.textContent).toContain('S. P. Dajkhosh, M. Hossain et al.');
        expect(fixture.nativeElement.textContent).toContain('M. Hossain et al.');
    });

    it('links to the complete publications route', () => {
        const link = fixture.nativeElement.querySelector('.publication-cta a');
        expect(link.getAttribute('href')).toBe('/publications');
    });

    it("preserves the five selected records, their ordering and resource choices", () => {
        expect(fixture.componentInstance.publications.map(({ id, ...record }) => record))
            .toEqual(SELECTED_PUBLICATION_BASELINE.map(record => ({ ...record, authors: [...record.authors] })));
        const element: HTMLElement = fixture.nativeElement;
        expect(Array.from(element.querySelectorAll(".publication-list h3 a")).map(link => link.getAttribute("href")))
            .toEqual(SELECTED_PUBLICATION_BASELINE.map(record => record.url));
    });
});

describe('formatSelectedAuthors', () => {
    it('shows the owner alone or as first author with coauthors', () => {
        expect(formatSelectedAuthors(['M. Hossain'])).toBe('M. Hossain');
        expect(formatSelectedAuthors(['M. Hossain', 'A. Author'])).toBe('M. Hossain et al.');
    });

    it('preserves first author, omitted middle authors, and whether authors follow the owner', () => {
        expect(formatSelectedAuthors(['A. Author', 'M. Hossain', 'B. Author'])).toBe('A. Author, M. Hossain et al.');
        expect(formatSelectedAuthors(['A. Author', 'B. Author', 'M. Hossain', 'C. Author'])).toBe('A. Author, …, M. Hossain et al.');
        expect(formatSelectedAuthors(['A. Author', 'B. Author', 'M. Hossain'])).toBe('A. Author, …, M. Hossain');
        expect(formatSelectedAuthors(['A. Author', 'M. Hossain'])).toBe('A. Author, M. Hossain');
    });

    it('does not invent the owner when absent', () => {
        expect(formatSelectedAuthors(['A. Author', 'B. Author'])).toBe('A. Author, B. Author');
        expect(formatSelectedAuthors([])).toBe('');
    });
});
