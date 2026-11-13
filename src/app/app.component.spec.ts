/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Implementation: src/app/app.component.ts */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApplicationRef } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { NavigationError, NavigationStart, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { AppComponent } from './app.component';
import { ScrollAnimationService } from './shared/scroll-animation.service';
import { ChunkLoadRecoveryService } from './shared/chunk-load-recovery.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule
      ],
      declarations: [
        AppComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'my-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('my-app');
  });

  it('renders the navigation, routed content, and footer shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('app-nav-bar')).not.toBeNull();
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
    expect(compiled.querySelector('app-nav-footer')).not.toBeNull();
  });

  it('cancels the old scroll animation when route navigation starts', () => {
    const events = new Subject<NavigationStart>();
    TestBed.overrideProvider(Router, { useValue: { url: '/home', events } });
    const fixture = TestBed.createComponent(AppComponent);
    const cancel = spyOn(TestBed.inject(ScrollAnimationService), 'cancel');
    fixture.detectChanges();
    events.next(new NavigationStart(2, '/publications'));
    expect(cancel).toHaveBeenCalled();
  });

  it('sends the latest failed route to chunk recovery and unsubscribes on destruction', () => {
    const events = new Subject<NavigationStart | NavigationError>();
    TestBed.overrideProvider(Router, { useValue: { url: '/home', events } });
    const recover = spyOn(TestBed.inject(ChunkLoadRecoveryService), 'tryReload');
    const fixture = TestBed.createComponent(AppComponent); fixture.detectChanges();
    const error = new TypeError('Failed to fetch dynamically imported module: /old.js');
    events.next(new NavigationStart(2, '/publications?q=one#papers'));
    events.next(new NavigationError(2, '/publications?q=one#papers', error));
    expect(recover).toHaveBeenCalledOnceWith('/publications?q=one#papers', error);
    fixture.destroy(); events.next(new NavigationError(2, '/publications', error));
    expect(recover).toHaveBeenCalledTimes(1);
  });

  it('does not reload for an obsolete navigation failure after a newer action', () => {
    const events = new Subject<NavigationStart | NavigationError>();
    TestBed.overrideProvider(Router, { useValue: { url: '/home', events } });
    const recover = spyOn(TestBed.inject(ChunkLoadRecoveryService), 'tryReload');
    const fixture = TestBed.createComponent(AppComponent); fixture.detectChanges();
    events.next(new NavigationStart(2, '/publications'));
    events.next(new NavigationStart(3, '/about'));
    events.next(new NavigationError(2, '/publications', new TypeError('Failed to fetch dynamically imported module: /old.js')));
    expect(recover).not.toHaveBeenCalled();
  });

  it('preserves a newer section or back-to-top action while a lazy route is pending', () => {
    const events = new Subject<NavigationStart | NavigationError>();
    TestBed.overrideProvider(Router, { useValue: { url: '/home', events } });
    const recover = spyOn(TestBed.inject(ChunkLoadRecoveryService), 'tryReload');
    const fixture = TestBed.createComponent(AppComponent); fixture.detectChanges();
    events.next(new NavigationStart(2, '/publications'));
    // Section navigation changes shared scroll ownership without a Router NavigationStart.
    TestBed.inject(ScrollAnimationService).cancel();
    events.next(new NavigationError(2, '/publications', new TypeError('Failed to fetch dynamically imported module: /old.js')));
    expect(recover).not.toHaveBeenCalled();
  });

  it('provides a single main landmark around routed content', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('main').length).toBe(1);
    expect(fixture.nativeElement.querySelector('main router-outlet')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('main app-nav-bar')).toBeNull();
    expect(fixture.nativeElement.querySelector('main app-nav-footer')).toBeNull();
  });

  it('restores the initial fragment after hydration readiness', fakeAsync(() => {
    spyOn(TestBed.inject(ApplicationRef), 'whenStable').and.returnValue(Promise.resolve());
    spyOnProperty(TestBed.inject(Router), 'url', 'get').and.returnValue('/research#selected-research');
    const scroll = spyOn(TestBed.inject(ViewportScroller), 'scrollToAnchor');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    flushMicrotasks();
    expect(scroll).toHaveBeenCalledWith('selected-research', { behavior: 'instant' });
  }));

  it('does not let initial fragment restoration override a newer scroll action', fakeAsync(() => {
    spyOn(TestBed.inject(ApplicationRef), 'whenStable').and.returnValue(Promise.resolve());
    spyOnProperty(TestBed.inject(Router), 'url', 'get').and.returnValue('/home#research');
    const scroll = spyOn(TestBed.inject(ViewportScroller), 'scrollToAnchor');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const animation = TestBed.inject(ScrollAnimationService);
    animation.scrollTo(0, 1500);
    animation.cancel();
    flushMicrotasks();
    expect(scroll).not.toHaveBeenCalled();
  }));

  it('does not restore an anchor after the root is destroyed', fakeAsync(() => {
    spyOn(TestBed.inject(ApplicationRef), 'whenStable').and.returnValue(Promise.resolve());
    spyOnProperty(TestBed.inject(Router), 'url', 'get').and.returnValue('/research#selected-research');
    const scroll = spyOn(TestBed.inject(ViewportScroller), 'scrollToAnchor');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    fixture.destroy();
    flushMicrotasks();
    expect(scroll).not.toHaveBeenCalled();
  }));

  it('preserves native scrolling before initial hydration settles', fakeAsync(() => {
    spyOn(TestBed.inject(ApplicationRef), 'whenStable').and.returnValue(Promise.resolve());
    spyOnProperty(TestBed.inject(Router), 'url', 'get').and.returnValue('/home#research');
    const viewport = TestBed.inject(ViewportScroller);
    let position: [number, number] = [0, 0];
    spyOn(viewport, 'getScrollPosition').and.callFake(() => position);
    const restore = spyOn(viewport, 'scrollToAnchor');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    position = [0, 500];
    flushMicrotasks();
    expect(restore).not.toHaveBeenCalled();
  }));

  it('preserves manual scrolling even when it returns to the original position', fakeAsync(() => {
    spyOn(TestBed.inject(ApplicationRef), 'whenStable').and.returnValue(Promise.resolve());
    spyOnProperty(TestBed.inject(Router), 'url', 'get').and.returnValue('/home#research');
    const viewport = TestBed.inject(ViewportScroller);
    let position: [number, number] = [0, 0];
    spyOn(viewport, 'getScrollPosition').and.callFake(() => position);
    const restore = spyOn(viewport, 'scrollToAnchor');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    position = [0, 500];
    window.dispatchEvent(new Event('scroll'));
    position = [0, 0];
    window.dispatchEvent(new Event('scroll'));
    flushMicrotasks();
    expect(restore).not.toHaveBeenCalled();
  }));

  it('releases initial scroll tracking on stability or destruction', fakeAsync(() => {
    spyOn(TestBed.inject(ApplicationRef), 'whenStable').and.returnValue(Promise.resolve());
    const remove = spyOn(window, 'removeEventListener').and.callThrough();
    const settled = TestBed.createComponent(AppComponent);
    settled.detectChanges();
    flushMicrotasks();
    settled.destroy();
    const departing = TestBed.createComponent(AppComponent);
    departing.detectChanges();
    departing.destroy();
    flushMicrotasks();
    expect(remove.calls.allArgs().filter(args => args[0] === 'scroll').length).toBe(2);
  }));
});
