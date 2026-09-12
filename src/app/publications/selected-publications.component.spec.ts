import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { SelectedPublicationsComponent } from './selected-publications.component';

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
    });

    it('links to the complete publications route', () => {
        const link = fixture.nativeElement.querySelector('.publication-cta a');
        expect(link.getAttribute('href')).toBe('/publications');
    });
});
