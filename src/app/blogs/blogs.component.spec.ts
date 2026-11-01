import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

import { BlogsComponent } from './blogs.component';
import { WindowRef } from '../shared/window.token';

describe('BlogsComponent', () => {
  let component: BlogsComponent;
  let fixture: ComponentFixture<BlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogsComponent],
      imports: [RouterModule.forRoot([])],
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

describe('Writing feed', () => {
  let fixture: ComponentFixture<BlogsComponent>;
  let http: HttpTestingController;
  const items = Array.from({ length: 5 }, (_, index) => ({
    title: `Post ${index + 1}`, link: `https://example.com/post/${index}`, description: 'A summary'
  }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogsComponent],
      imports: [RouterModule.forRoot([])],
      providers: [provideHttpClient(), provideHttpClientTesting(),
        { provide: WindowRef, useValue: { nativeWindow: () => window } }]
    }).compileComponents();
    fixture = TestBed.createComponent(BlogsComponent);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('limits the homepage to three posts and links to the local archive', () => {
    fixture.componentInstance.preview = true;
    fixture.detectChanges();
    http.expectOne('/feed').flush(items);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.writing-post').length).toBe(3);
    expect(fixture.nativeElement.querySelector('.writing-link').getAttribute('href')).toBe('/blog');
  });

  it('renders every returned post on the standalone page', () => {
    fixture.detectChanges();
    http.expectOne('/feed').flush(items);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.writing-post').length).toBe(5);
  });

  it('shows the fallback after a stalled feed and cancels the request', fakeAsync(() => {
    fixture.componentInstance.preview = true;
    fixture.detectChanges();
    const request = http.expectOne('/feed');
    tick(10001);
    fixture.detectChanges();
    expect(request.cancelled).toBeTrue();
    expect(fixture.componentInstance.loading).toBeFalse();
    expect(fixture.nativeElement.textContent).toContain('Recent posts are unavailable');
    expect(fixture.nativeElement.querySelector('.writing-link').getAttribute('href')).toBe('https://medium.hmazharul.com/');
  }));

  it('shows the fallback for a failed feed', () => {
    fixture.componentInstance.preview = true;
    fixture.detectChanges();
    http.expectOne('/feed').flush({}, { status: 502, statusText: 'Bad Gateway' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Recent posts are unavailable');
    const link = fixture.nativeElement.querySelector('.writing-link');
    expect(link.getAttribute('href')).toBe('https://medium.hmazharul.com/');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('links directly to Medium when the homepage feed returns no posts', () => {
    fixture.componentInstance.preview = true;
    fixture.detectChanges();
    http.expectOne('/feed').flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.writing-link').getAttribute('href')).toBe('https://medium.hmazharul.com/');
  });

  it('links directly to Medium when the standalone feed fails', () => {
    fixture.detectChanges();
    http.expectOne('/feed').flush({}, { status: 502, statusText: 'Bad Gateway' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.writing-link').getAttribute('href')).toBe('https://medium.hmazharul.com/');
  });
});
