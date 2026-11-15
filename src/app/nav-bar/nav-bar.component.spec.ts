/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Implementation: src/app/nav-bar/nav-bar.component.ts */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarComponent } from './nav-bar.component';
import { DOCUMENT, Location } from '@angular/common';
import { Router } from '@angular/router';
import { WindowRef } from '../shared/window.token';
import { ScrollAnimationService } from '../shared/scroll-animation.service';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('orders About before Writing and Contact', () => {
    const labels = Array.from(fixture.nativeElement.querySelectorAll('.navbar-nav .page-scroll') as NodeListOf<HTMLAnchorElement>)
      .map((link: HTMLAnchorElement) => link.textContent?.trim());

    expect(labels.slice(-3)).toEqual(['About', 'Writing', 'Contact']);
  });

  it('provides ordinary destinations for all seven navigation links', () => {
    const links = Array.from(fixture.nativeElement.querySelectorAll('.page-scroll')) as HTMLAnchorElement[];
    expect(links.map(link => link.getAttribute('href'))).toEqual(['/home', '/research', '/publications', '/experience', '/about', '/blog', '/contact']);
  });

  for (const modifier of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
    it(`preserves native navigation for ${JSON.stringify(modifier)}`, () => {
      const link = fixture.nativeElement.querySelector('[data-custom-id="research"]') as HTMLAnchorElement;
      const navigate = spyOn(component, 'navigateToSection');
      component.navbarOpen = true;
      let prevented: boolean | undefined;
      // Observe the handler before suppressing the browser's real default navigation in Karma.
      link.addEventListener('click', event => { prevented = event.defaultPrevented; event.preventDefault(); }, { once: true });
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ...modifier }));
      expect(prevented).toBeFalse();
      expect(navigate).not.toHaveBeenCalled();
      expect(component.navbarOpen).toBeTrue();
    });
  }

  it('enhances an ordinary primary click and closes the mobile menu', () => {
    const link = fixture.nativeElement.querySelector('[data-custom-id="research"]') as HTMLAnchorElement;
    const navigate = spyOn(component, 'navigateToSection');
    component.navbarOpen = true;
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(click);
    expect(click.defaultPrevented).toBeTrue();
    expect(navigate).toHaveBeenCalledOnceWith('research');
    expect(component.navbarOpen).toBeFalse();
  });

  it('keeps the section offset independent of the absolute mobile menu', () => {
    const navigation: HTMLElement = fixture.nativeElement.querySelector('.navigation');
    const menu: HTMLElement = fixture.nativeElement.querySelector('.navbar-collapse');
    const section = document.createElement('section');
    section.id = 'offset-regression-target';
    document.body.appendChild(section);
    spyOn(navigation, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 0, 360, 75));
    spyOn(menu, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 75, 360, 230));
    spyOn(section, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 500, 360, 400));
    spyOnProperty(window, 'scrollY', 'get').and.returnValue(0);
    const scroll = spyOn(TestBed.inject(ScrollAnimationService), 'scrollTo');
    spyOn(TestBed.inject(Location), 'replaceState');

    try {
      menu.classList.add('show');
      component.navigateToSection(section.id);
      expect(scroll).toHaveBeenCalledWith(409, 1000);
      scroll.calls.reset();
      menu.classList.remove('show');
      component.navigateToSection(section.id);
      expect(scroll).toHaveBeenCalledWith(409, 1000);
    } finally {
      section.remove();
    }
  });
});

describe('NavBarComponent injected browser boundaries', () => {
  it('uses its injected document and window for scrolling, active state and owned listeners', async () => {
    const alternateDocument = document.implementation.createHTMLDocument('Navigation fixture');
    Object.defineProperty(alternateDocument, 'defaultView', { value: window });
    const browser = Object.assign(new EventTarget(), { scrollY: 500, scrollTo: jasmine.createSpy('scrollTo') });
    const windowRef = new WindowRef('browser');
    spyOn(windowRef, 'nativeWindow').and.returnValue(browser as unknown as Window);
    await TestBed.configureTestingModule({
      declarations: [NavBarComponent],
      providers: [{ provide: DOCUMENT, useValue: alternateDocument }, { provide: WindowRef, useValue: windowRef }]
    }).compileComponents();
    const fixture = TestBed.createComponent(NavBarComponent);
    alternateDocument.body.append(fixture.nativeElement);
    fixture.detectChanges();
    const section = alternateDocument.createElement('section');
    section.id = 'research';
    alternateDocument.body.append(section);
    spyOn(section, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 100, 360, 1000));
    spyOnProperty(section, 'offsetHeight', 'get').and.returnValue(1000);
    const header = fixture.nativeElement.querySelector('.navigation') as HTMLElement;
    spyOn(header, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 0, 360, 75));
    const location = spyOn(TestBed.inject(Location), 'replaceState');
    spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const scroll = spyOn(TestBed.inject(ScrollAnimationService), 'scrollTo');
    try {
      fixture.componentInstance.navigateToSection('research');
      expect(scroll).toHaveBeenCalledOnceWith(509, 1000);
      expect(location).toHaveBeenCalledWith('research');
      browser.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      expect(header.classList.contains('sticky')).toBeTrue();
      expect(fixture.nativeElement.querySelector('[data-custom-id="research"]').getAttribute('aria-current')).toBe('location');
      header.classList.remove('sticky');
      fixture.destroy();
      browser.dispatchEvent(new Event('scroll'));
      expect(header.classList.contains('sticky')).toBeFalse();
    } finally { fixture.destroy(); }
  });
});
