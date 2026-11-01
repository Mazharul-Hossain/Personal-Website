import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { IndexPageComponent } from './index-page.component';
import { WindowRef } from '../shared/window.token';

describe('IndexPageComponent', () => {
  let component: IndexPageComponent;
  let fixture: ComponentFixture<IndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexPageComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the portfolio owner and primary sections', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('h1')?.textContent).toContain('Mazharul Hossain');
    expect(element.querySelector('.research-title')?.textContent).toContain('Computational Imaging');
    expect(element.querySelector('.header-image-caption')?.textContent).toContain('Robust ML');
    expect(element.querySelector('#parallax .header-shape')).not.toBeNull();
    expect(element.querySelector('.main-btn')?.getAttribute('href')).toBe('#research');
    expect(element.querySelector('app-research-overview')).not.toBeNull();
    expect(element.querySelector('app-selected-research')).not.toBeNull();
    expect(element.querySelector('app-selected-publications')).not.toBeNull();
    expect(element.querySelector('app-research-journey')).not.toBeNull();
    expect(element.querySelector('app-about-me')).not.toBeNull();
    expect(element.querySelector('app-contact-me')).not.toBeNull();
  });
});

describe('IndexPageComponent parallax cleanup', () => {
  it('does not let a pending orientation check restart a destroyed instance', fakeAsync(() => {
    const enable = jasmine.createSpy('enable');
    const disable = jasmine.createSpy('disable');
    const instance = { enable, disable };
    const fakeWindow = {
      Parallax: class {
        constructor() {
          setTimeout(() => instance.enable(), 500);
          return instance;
        }
      }
    };
    TestBed.configureTestingModule({
      declarations: [IndexPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: WindowRef, useValue: { nativeWindow: () => fakeWindow } }]
    });
    const fixture = TestBed.createComponent(IndexPageComponent);
    fixture.detectChanges();
    fixture.destroy();
    tick(500);
    expect(disable).toHaveBeenCalledTimes(1);
    expect(enable).not.toHaveBeenCalled();
  }));
});
