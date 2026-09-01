import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { BlogsComponent } from './blogs.component';
import { WindowRef } from '../shared/window.token';

describe('BlogsComponent', () => {
  let component: BlogsComponent;
  let fixture: ComponentFixture<BlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogsComponent],
      providers: [
        provideHttpClient(),
        { provide: WindowRef, useValue: { nativeWindow: () => undefined } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
