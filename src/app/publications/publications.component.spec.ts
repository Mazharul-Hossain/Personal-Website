import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationsComponent } from './publications.component';

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
});
