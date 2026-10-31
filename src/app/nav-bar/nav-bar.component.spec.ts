import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarComponent } from './nav-bar.component';

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
});
