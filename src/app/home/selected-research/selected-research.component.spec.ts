import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedResearchComponent } from './selected-research.component';

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
});
