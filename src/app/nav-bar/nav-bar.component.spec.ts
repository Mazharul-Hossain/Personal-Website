/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Implementation: src/app/nav-bar/nav-bar.component.ts */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarComponent } from './nav-bar.component';
import { Location } from '@angular/common';
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
