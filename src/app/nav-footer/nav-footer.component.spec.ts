/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Implementation: src/app/nav-footer/nav-footer.component.ts */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NavFooterComponent } from './nav-footer.component';
import { ScrollAnimationService } from '../shared/scroll-animation.service';
import { ElementRef, Renderer2 } from '@angular/core';
import { WindowRef } from '../shared/window.token';

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

    it('listens to and reads the injected browser instead of the global window', () => {
        const browser = Object.assign(new EventTarget(), { scrollY: 501 });
        const windowRef = new WindowRef('browser');
        spyOn(windowRef, 'nativeWindow').and.returnValue(browser as unknown as Window);
        const renderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['listen', 'setStyle']);
        renderer.listen.and.returnValue(() => {});
        const host = document.createElement('div');
        host.innerHTML = '<a class="back-to-top"></a>';
        const footer = new NavFooterComponent(renderer, new ElementRef(host), windowRef, TestBed.inject(ScrollAnimationService));
        footer.ngAfterViewInit();
        try {
            expect(renderer.listen.calls.argsFor(0)[0]).toBe(browser);
            const onScroll = renderer.listen.calls.argsFor(0)[2];
            spyOnProperty(window, 'scrollY', 'get').and.returnValue(0);
            onScroll(new Event('scroll'));
            expect(renderer.setStyle).toHaveBeenCalledWith(host.firstElementChild, 'opacity', '1');
        } finally { footer.ngOnDestroy(); }
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

    it('hides the button after its 200ms fade when near the top', fakeAsync(() => {
        const button: HTMLElement = fixture.nativeElement.querySelector('.back-to-top');
        let scrollPosition = 500;
        spyOnProperty(window, 'scrollY', 'get').and.callFake(() => scrollPosition);
        window.dispatchEvent(new Event('scroll'));
        scrollPosition = 100;
        window.dispatchEvent(new Event('scroll'));
        tick(199);
        expect(button.style.opacity).toBe('0');
        expect(button.style.display).toBe('block');
        tick(1);
        expect(button.style.display).toBe('none');
    }));

    it('animates back to top and cancels the shared animation at teardown', () => {
        const animation = TestBed.inject(ScrollAnimationService);
        const scroll = spyOn(animation, 'scrollTo');
        const cancel = spyOn(animation, 'cancel');
        const button: HTMLElement = fixture.nativeElement.querySelector('.back-to-top');
        const click = new MouseEvent('click', { cancelable: true });
        button.dispatchEvent(click);
        expect(click.defaultPrevented).toBeTrue();
        expect(scroll).toHaveBeenCalledOnceWith(0, 1500);
        fixture.destroy();
        expect(cancel).toHaveBeenCalledTimes(1);
        button.dispatchEvent(new MouseEvent('click', { cancelable: true }));
        expect(scroll).toHaveBeenCalledTimes(1);
    });
});
