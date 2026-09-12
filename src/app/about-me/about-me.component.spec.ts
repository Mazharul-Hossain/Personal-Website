import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutMeComponent } from './about-me.component';

describe('AboutMeComponent', () => {
  let component: AboutMeComponent;
  let fixture: ComponentFixture<AboutMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutMeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the research biography without stale job-search content', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('h2')?.textContent).toContain('Research grounded in measurements');
    expect(element.querySelector('#skills-heading')?.textContent).toContain('Skills');
    expect(element.textContent).toContain('Machine Learning & AI');
    expect(element.textContent).toContain('TODO:<ADD TRUE DETAILS>');
    expect(element.textContent).not.toContain('Interested for Internship and Fulltime');
  });
});
