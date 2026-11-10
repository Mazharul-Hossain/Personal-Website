/* @agent Read: .agents/skills/portfolio-angular/SKILL.md; .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/BUNDLE_OPTIMIZATION_PLAN.md
Implementation: src/app/nav-bar/nav-bar.component.ts; src/app/app.component.ts; src/app/shared/scroll-animation.service.ts */
export {};

const sections = ["home", "research", "publications", "experience", "about", "blog", "contact"] as const;

function visitHydratedHome(width = 1280): void {
    cy.viewport(width, 844);
    cy.visit("/home");
    // This class is set by the component, unlike the CSS-only preloader fallback.
    cy.get(".preloader").should("have.class", "is-hidden");
}

interface AngularTestWindow extends Window {
    getAllAngularTestabilities?: () => Array<{ whenStable(callback: () => void): void }>;
}

function waitForAngularReady(): void {
    // BrowserModule exposes testability only after bootstrap; SSR DOM alone is not readiness.
    cy.window().should(win => {
        expect((win as AngularTestWindow).getAllAngularTestabilities?.().length || 0, "bootstrapped Angular roots").to.be.greaterThan(0);
    }).then({ timeout: 10000 }, win => new Cypress.Promise<void>(resolve => {
        const apps = (win as AngularTestWindow).getAllAngularTestabilities?.() || [];
        if (!apps.length) throw new Error("Angular testability is unavailable");
        let pending = apps.length;
        apps.forEach(app => app.whenStable(() => { if (--pending === 0) resolve(); }));
    }));
}

function waitForScrollToSettle(headingSelector?: string): void {
    cy.window().then({ timeout: 6000 }, win => new Cypress.Promise<void>((resolve, reject) => {
        const geometry = () => [
            win.scrollY,
            headingSelector ? win.document.querySelector(headingSelector)?.getBoundingClientRect().top || 0 : 0,
            win.document.querySelector(".navigation")?.getBoundingClientRect().bottom || 0
        ];
        let previous = geometry();
        let stableFrames = 0;
        const started = win.performance.now();
        const sample = () => {
            const current = geometry();
            stableFrames = current.every((value, index) => Math.abs(value - previous[index]) < 0.5) ? stableFrames + 1 : 0;
            previous = current;
            if (stableFrames >= 30) return resolve();
            if (win.performance.now() - started > 5000) return reject(new Error("Scrolling did not settle"));
            win.requestAnimationFrame(sample);
        };
        win.requestAnimationFrame(sample);
    }));
}

function expectHeadingClear(selector: string, diagnostic: () => string = () => ""): void {
    cy.get(selector).should($heading => {
        const heading = $heading[0].getBoundingClientRect();
        const navigation = $heading[0].ownerDocument.querySelector(".navigation")!.getBoundingClientRect();
        expect(heading.top, `${selector} clears the fixed navigation ${diagnostic()}`).to.be.at.least(navigation.bottom);
        expect(heading.bottom, `${selector} is inside the viewport`).to.be.at.most($heading[0].ownerDocument.defaultView!.innerHeight);
    });
}

describe("Navigation contracts — Phase 1A", () => {
    beforeEach(() => cy.intercept("GET", "/feed", []));
    let releasePendingFeed: (() => void) | undefined;
    afterEach(() => {
        releasePendingFeed?.();
        releasePendingFeed = undefined;
    });

    for (const width of [1280, 390]) {
        for (const section of sections) {
            it(`activates ${section} with the keyboard at ${width}px`, () => {
                visitHydratedHome(width);
                let menuGeometry = "";
                cy.window().then(win => {
                    const initialHistoryLength = win.history.length;
                    if (width < 992) {
                        // BUG-09 regression: the absolute menu must not affect the header offset.
                        cy.get(".navbar-toggler").focus();
                        cy.press(Cypress.Keyboard.Keys.SPACE);
                        cy.get(".navbar-toggler").should("have.attr", "aria-expanded", "true");
                        cy.get(".navigation").then($navigation => {
                            const menu = $navigation[0].querySelector<HTMLElement>(".navbar-collapse.show")!;
                            menuGeometry = `navigationHeight=${$navigation[0].getBoundingClientRect().height}, menuHeight=${menu.getBoundingClientRect().height}, menuPosition=${win.getComputedStyle(menu).position}`;
                        });
                    }
                    cy.get(`.navigation [data-custom-id="${section}"]`).focus().should("have.focus");
                    cy.press(Cypress.Keyboard.Keys.ENTER);
                    cy.location("pathname").should("eq", `/${section}`);
                    cy.get("#home").should("exist");
                    const heading = section === "home" ? "#home h1" : `#${section} h2`;
                    waitForScrollToSettle(heading);
                    expectHeadingClear(heading, () => menuGeometry);
                    cy.get(`.navigation [data-custom-id="${section}"]`).parent().should("have.class", "active");
                    cy.get(".navigation .nav-item.active").should("have.length", 1);
                    if (width < 992) cy.get(".navbar-toggler").should("have.attr", "aria-expanded", "false");
                    // Section changes intentionally replace the current URL entry.
                    cy.window().its("history.length").should("eq", initialHistoryLength);
                    cy.title().should("eq", "Mazharul Hossain | Computational Imaging & Scientific Machine Learning");
                    if (section === "research") cy.screenshot(`research-navigation-${width}px`, { capture: "viewport" });
                });
            });
        }

        it(`reaches every navigation item with Tab at ${width}px`, () => {
            visitHydratedHome(width);
            cy.get(".navbar-brand").focus();
            if (width < 992) {
                cy.press(Cypress.Keyboard.Keys.TAB);
                cy.get(".navbar-toggler").should("have.focus");
                // Keep native Space coverage here; complete Enter/button coverage uses the verified keyboard helper in layout-works.
                cy.press(Cypress.Keyboard.Keys.SPACE);
                cy.get(".navbar-toggler").should("have.attr", "aria-expanded", "true");
            }
            for (const section of sections) {
                cy.press(Cypress.Keyboard.Keys.TAB);
                cy.get(`.navigation [data-custom-id="${section}"]`).should("have.focus");
            }
        });

        it(`restores route composition and metadata with back/forward at ${width}px`, () => {
            visitHydratedHome(width);
            cy.get(".publication-cta a").click();
            cy.location("pathname").should("eq", "/publications");
            if (width < 992) cy.get(".navbar-toggler").click();
            cy.get('.navigation [data-custom-id="about"]').click();
            cy.location("pathname").should("eq", "/about");

            cy.go("back");
            cy.location("pathname").should("eq", "/publications");
            cy.get("li[data-publication-id]").should("have.length", 14);
            cy.title().should("eq", "Publications | Mazharul Hossain");
            cy.get("#home").should("not.exist");
            cy.go("back");
            cy.location("pathname").should("eq", "/home");
            cy.get("#home").should("exist");
            cy.get(".preloader").should("have.class", "is-hidden");
            cy.get("#publications .publication-list li").should("have.length", 5);
            cy.title().should("eq", "Mazharul Hossain | Computational Imaging & Scientific Machine Learning");
            cy.go("forward");
            cy.location("pathname").should("eq", "/publications");
            cy.get("li[data-publication-id]").should("have.length", 14);
            cy.go("forward");
            cy.location("pathname").should("eq", "/about");
            cy.get("#home").should("not.exist");
            cy.title().should("eq", "About Me | Mazharul Hossain");
        });

        // BUG-05 regressions: preserve hydrated fragments and fixed-header clearance.
        it(`positions a directly loaded research fragment below navigation at ${width}px`, () => {
            cy.viewport(width, 844);
            cy.visit("/research#selected-research");
            waitForAngularReady();
            cy.location("hash").should("eq", "#selected-research");
            waitForScrollToSettle("#selected-research h2");
            cy.window().its("scrollY").should("be.greaterThan", 0);
            expectHeadingClear("#selected-research h2");
        });

        it(`retains the research fragment destination after reload at ${width}px`, () => {
            cy.viewport(width, 844);
            cy.visit("/research#selected-research");
            waitForAngularReady();
            cy.reload();
            waitForAngularReady();
            cy.location("hash").should("eq", "#selected-research");
            waitForScrollToSettle("#selected-research h2");
            cy.window().its("scrollY").should("be.greaterThan", 0);
            expectHeadingClear("#selected-research h2");
        });

        it(`positions a client-side research fragment below navigation at ${width}px`, () => {
            cy.viewport(width, 844);
            cy.visit("/research");
            waitForAngularReady();
            cy.get("#research h2").should("be.visible");
            // A native fragment change exercises both browser and Angular scrolling.
            cy.window().then(win => { win.location.hash = "selected-research"; });
            cy.location("hash").should("eq", "#selected-research");
            waitForScrollToSettle("#selected-research h2");
            expectHeadingClear("#selected-research h2");
        });
    }

    it("keeps a newer homepage section action when initial hydration was delayed", () => {
        cy.intercept("GET", "/feed", { body: [], delay: 1200 }).as("delayedFeed");
        cy.viewport(1280, 844);
        cy.visit("/home#research");
        cy.get(".preloader").should("have.class", "is-hidden");
        cy.get('[data-custom-id="about"]').click();
        cy.location("pathname").should("eq", "/about");
        cy.wait("@delayedFeed");
        waitForAngularReady();
        waitForScrollToSettle("#about h2");
        expectHeadingClear("#about h2");
        cy.get("#home").should("exist");
    });

    it("preserves native PageDown scrolling while initial hydration is pending", () => {
        cy.intercept("GET", "/feed", request => new Cypress.Promise<void>(resolve => {
            releasePendingFeed = () => { request.reply([]); resolve(); };
        })).as("heldFeed");
        cy.viewport(1280, 844);
        cy.visit("/home#research");
        cy.get(".preloader").should("have.class", "is-hidden");
        let start = 0;
        let manualPosition = 0;
        cy.document().then(doc => doc.fonts.ready);
        cy.window().then(win => { start = win.scrollY; win.focus(); });
        cy.then(() => Cypress.automation("remote:debugger:protocol", {
            command: "Input.dispatchKeyEvent",
            params: { type: "keyDown", key: "PageDown", code: "PageDown", windowsVirtualKeyCode: 34 }
        }));
        cy.then(() => Cypress.automation("remote:debugger:protocol", {
            command: "Input.dispatchKeyEvent",
            params: { type: "keyUp", key: "PageDown", code: "PageDown", windowsVirtualKeyCode: 34 }
        }));
        cy.window().should(win => expect(win.scrollY, "native paging moved the viewport").to.be.greaterThan(start + 50));
        waitForScrollToSettle();
        cy.window().then(win => {
            manualPosition = win.scrollY;
            expect(releasePendingFeed).to.be.a("function");
            const release = releasePendingFeed!;
            releasePendingFeed = undefined;
            release();
        });
        cy.wait("@heldFeed");
        waitForAngularReady();
        waitForScrollToSettle();
        cy.window().should(win => expect(win.scrollY, "hydration preserves the manual destination").to.be.closeTo(manualPosition, 1));
        cy.location("hash").should("eq", "#research");
    });

    // BUG-08 regressions: route/history navigation must discard the previous animation.
    it("keeps the destination page at the top when a route change interrupts navbar scrolling", () => {
        visitHydratedHome();
        cy.window().then(win => cy.spy(win, "scrollTo").as("navbarScroll"));
        cy.get('.navigation [data-custom-id="contact"]').click();
        cy.get("@navbarScroll").should(spy => expect((spy as unknown as sinon.SinonSpy).callCount).to.be.greaterThan(1));
        // Trigger the real router link immediately; Cypress auto-scrolling to click it would consume the animation.
        cy.get<HTMLAnchorElement>(".publication-cta a").then($link => $link[0].click());
        cy.location("pathname").should("eq", "/publications");
        cy.get("#home").should("not.exist");
        cy.wait(1200); // Observe beyond the discarded one-second animation's completion.
        cy.window().its("scrollY").should("eq", 0);
    });

    it("stops the old back-to-top animation when browser history opens another route", () => {
        visitHydratedHome();
        cy.get(".publication-cta a").click();
        cy.location("pathname").should("eq", "/publications");
        cy.go("back");
        cy.location("pathname").should("eq", "/home");
        cy.get(".preloader").should("have.class", "is-hidden");
        cy.scrollTo(0, 3000, { duration: 0 });
        cy.window().then(win => cy.spy(win, "scrollTo").as("historyScroll"));
        cy.get(".back-to-top").should("be.visible").click();
        cy.get("@historyScroll").should(spy => expect((spy as unknown as sinon.SinonSpy).callCount).to.be.greaterThan(1));
        cy.go("forward");
        cy.location("pathname").should("eq", "/publications");
        cy.get("#home").should("not.exist");
        cy.get("@historyScroll").then(spy => (spy as unknown as sinon.SinonSpy).resetHistory());
        cy.wait(1600); // Include the entire discarded 1.5-second animation tail.
        cy.get("@historyScroll").should(spy => {
            const lateWrites = (spy as unknown as sinon.SinonSpy).getCalls().filter(call => {
                const options = call.args[0] as ScrollToOptions | undefined;
                return typeof options === "object" && options.behavior === "instant" && (options.top || 0) > 1;
            });
            expect(lateWrites.length, "discarded animation writes into the destination route").to.eq(0);
        });
        cy.window().its("scrollY").should("eq", 0);
    });
});
