import { TestBed } from '@angular/core/testing';
import { ScrollAnimationService } from './scroll-animation.service';
import { WindowRef } from './window.token';

describe('ScrollAnimationService', () => {
    let callbacks: Map<number, FrameRequestCallback>;
    let fakeWindow: Window;
    let service: ScrollAnimationService;
    let nextFrame: number;

    beforeEach(() => {
        callbacks = new Map();
        nextFrame = 0;
        fakeWindow = {
            scrollY: 500,
            requestAnimationFrame: (callback: FrameRequestCallback) => {
                const id = ++nextFrame;
                callbacks.set(id, callback);
                return id;
            },
            cancelAnimationFrame: (id: number) => callbacks.delete(id),
            scrollTo: jasmine.createSpy('scrollTo')
        } as unknown as Window;
        TestBed.configureTestingModule({
            providers: [{ provide: WindowRef, useValue: { nativeWindow: () => fakeWindow } }]
        });
        service = TestBed.inject(ScrollAnimationService);
    });

    it('cancels the previous animation and completes the newest destination', () => {
        service.scrollTo(0, 1500);
        expect(callbacks.has(1)).toBeTrue();
        service.scrollTo(1000, 1000);
        expect(callbacks.has(1)).toBeFalse();
        const frame = callbacks.get(2)!;
        callbacks.delete(2);
        frame(100);
        const next = callbacks.get(3)!;
        callbacks.delete(3);
        next(1100);
        expect((fakeWindow.scrollTo as jasmine.Spy).calls.mostRecent().args[0])
            .toEqual({ top: 1000, behavior: 'instant' });
        expect(callbacks.size).toBe(0);
    });

    it('does nothing when no browser window is available', () => {
        TestBed.inject(WindowRef).nativeWindow = () => undefined;
        expect(() => service.scrollTo(0, 1500)).not.toThrow();
        expect(callbacks.size).toBe(0);
    });
});
