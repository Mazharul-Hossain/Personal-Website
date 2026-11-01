import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NavFooterComponent } from './nav-footer.component';

describe('NavFooterComponent', () => {
    let component: NavFooterComponent;
    let fixture: ComponentFixture<NavFooterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NavFooterComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavFooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('keeps the button visible when scrolling down during its fade-out', fakeAsync(() => {
        const button: HTMLElement = fixture.nativeElement.querySelector('.back-to-top');
        let scrollPosition = 100;
        spyOnProperty(window, 'scrollY', 'get').and.callFake(() => scrollPosition);

        window.dispatchEvent(new Event('scroll'));
        tick(100);
        scrollPosition = 500;
        window.dispatchEvent(new Event('scroll'));
        tick(200);

        expect(button.style.display).toBe('block');
        expect(button.style.opacity).toBe('1');
    }));
});
