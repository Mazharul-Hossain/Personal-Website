/* @agent Read: .agents/skills/portfolio-verification/SKILL.md; .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/STYLESHEET_REFINEMENT_PLAN.md
Implementation: src/app/nav-footer/nav-footer.component.ts; src/app/index-page/index-page.component.ts; src/app/page-not-found/page-not-found.component.ts */
import { ElementRef, Renderer2, NgZone } from "@angular/core";
import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { Router } from "@angular/router";
import { NavFooterComponent } from "../nav-footer/nav-footer.component";
import { IndexPageComponent } from "../index-page/index-page.component";
import { PageNotFoundComponent } from "../page-not-found/page-not-found.component";
import { ScrollAnimationService } from "./scroll-animation.service";
import { WindowRef } from "./window.token";

describe("Phase 1E — lifecycle regressions", () => {
    const windowRef = new WindowRef("browser");

    it("cancels the preloader callback after destruction", fakeAsync(() => {
        const component = new IndexPageComponent(new ElementRef(document.createElement("div")), windowRef, TestBed.inject(NgZone));
        component.ngAfterViewInit();
        component.ngOnDestroy();
        tick(600);
        expect(component.preloaderVisible).toBeTrue();
    }));

    it("does not redirect after leaving the 404 component", fakeAsync(() => {
        const router = jasmine.createSpyObj<Router>("Router", ["navigate"]);
        const component = new PageNotFoundComponent(router, windowRef);
        component.ngOnInit();
        component.ngOnDestroy();
        tick(5100);
        expect(router.navigate).not.toHaveBeenCalled();
    }));

    it("releases footer listeners and pending fade callback", fakeAsync(() => {
        const renderer = jasmine.createSpyObj<Renderer2>("Renderer2", ["listen", "setStyle"]);
        const unlisten = jasmine.createSpy("unlisten");
        let onScroll: (() => void) | undefined;
        renderer.listen.and.callFake((_target, event, callback) => {
            if (event === "scroll") onScroll = () => { callback(new Event("scroll")); };
            return unlisten;
        });
        const host = document.createElement("div");
        host.innerHTML = '<a class="back-to-top"></a>';
        const scroll = jasmine.createSpyObj<ScrollAnimationService>("ScrollAnimationService", ["scrollTo", "cancel"]);
        const component = new NavFooterComponent(renderer, new ElementRef(host), windowRef, scroll);
        component.ngAfterViewInit();
        spyOnProperty(window, "scrollY", "get").and.returnValue(0);
        onScroll?.();
        component.ngOnDestroy();
        renderer.setStyle.calls.reset();
        tick(250);
        expect(unlisten).toHaveBeenCalledTimes(2);
        expect(renderer.setStyle).not.toHaveBeenCalled();
    }));

    it("keeps the preloader visible for 500ms before revealing the page", fakeAsync(() => {
        const component = new IndexPageComponent(new ElementRef(document.createElement("div")), windowRef, TestBed.inject(NgZone));
        component.ngAfterViewInit();
        tick(499);
        expect(component.preloaderVisible).toBeTrue();
        tick(1);
        expect(component.preloaderVisible).toBeFalse();
        component.ngOnDestroy();
    }));

    it("redirects the active 404 component only after five seconds", fakeAsync(() => {
        const router = jasmine.createSpyObj<Router>("Router", ["navigate"]);
        const component = new PageNotFoundComponent(router, windowRef);
        component.ngOnInit();
        tick(4999);
        expect(router.navigate).not.toHaveBeenCalled();
        tick(1);
        expect(router.navigate).toHaveBeenCalledOnceWith(['/']);
        component.ngOnDestroy();
        tick(5000);
        expect(router.navigate).toHaveBeenCalledTimes(1);
    }));

    it("does not start browser callbacks or footer listeners during SSR", fakeAsync(() => {
        const serverWindow = new WindowRef("server");
        const renderer = jasmine.createSpyObj<Renderer2>("Renderer2", ["listen", "setStyle"]);
        const router = jasmine.createSpyObj<Router>("Router", ["navigate"]);
        const scroll = new ScrollAnimationService(serverWindow);
        const host = new ElementRef(document.createElement("div"));
        const footer = new NavFooterComponent(renderer, host, serverWindow, scroll);
        const index = new IndexPageComponent(host, serverWindow, TestBed.inject(NgZone));
        const notFound = new PageNotFoundComponent(router, serverWindow);
        footer.ngAfterViewInit();
        index.ngAfterViewInit();
        notFound.ngOnInit();
        footer.ngOnDestroy();
        footer.ngOnDestroy();
        index.ngOnDestroy();
        notFound.ngOnDestroy();
        tick(5100);
        expect(renderer.listen).not.toHaveBeenCalled();
        expect(renderer.setStyle).not.toHaveBeenCalled();
        expect(index.preloaderVisible).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
    }));
});
