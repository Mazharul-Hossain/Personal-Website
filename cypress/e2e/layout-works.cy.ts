/* @agent Read: .agents/skills/portfolio-verification/SKILL.md; .agents/skills/portfolio-design/SKILL.md
Policy: README.md#behavioral-contracts; docs/BUNDLE_OPTIMIZATION_PLAN.md
Implementation: src/app/works/works.component.ts; src/app/works/works.component.html; global order: angular.json
Native keyboard control: cypress/support/native-keyboard.ts */
import { pressNativeEnter } from "../support/native-keyboard";
export {};

function waitForRenderedApp(): void {
    type TestWindow = Window & { getAllAngularTestabilities?: () => unknown[] };
    cy.window().should(win => expect((win as TestWindow).getAllAngularTestabilities?.().length || 0).to.be.greaterThan(0));
    // Do not gate layout on unrelated analytics/network tasks becoming globally idle.
    cy.document().then(doc => doc.fonts.ready);
    cy.window().then(win => new Cypress.Promise<void>(resolve => {
        let frames = 0;
        const sample = () => { if (++frames >= 30) resolve(); else win.requestAnimationFrame(sample); };
        win.requestAnimationFrame(sample);
    }));
}

describe("Phase 1B — document overflow", () => {
    beforeEach(() => cy.intercept("GET", "/feed", []));
    for (const width of [360, 390, 1280]) {
        for (const route of ["/home", "/research", "/publications", "/work"]) {
            it(`contains ${route} at ${width}px with menu closed and open`, () => {
                cy.viewport(width, 844);
                cy.visit(route);
                waitForRenderedApp();
                if (route === "/home") cy.get(".preloader").should("have.class", "is-hidden");
                cy.get(".navbar-toggler").should("exist");
                const check = () => cy.document().should(doc => {
                    const viewport = doc.documentElement.clientWidth;
                    const offenders = Array.from(doc.querySelectorAll("body *")).filter(el => {
                        const rect = el.getBoundingClientRect();
                        return rect.width && (rect.right > viewport + 1 || rect.left < -1) && !el.closest("#work .overflow-auto");
                    }).map(el => `${el.tagName}.${el.className}`).slice(0, 12);
                    expect(doc.documentElement.scrollWidth, offenders.join(", ")).to.be.at.most(viewport + 1);
                });
                check();
                if (width < 992) {
                    cy.get(".navbar-toggler").click();
                    cy.get(".navbar-collapse").should("have.class", "show");
                    check();
                }
            });
        }
    }
    it("keeps Works horizontal scrolling inside its gallery", () => {
        cy.viewport(360, 844);
        cy.visit("/work");
        waitForRenderedApp();
        cy.get("#work .overflow-auto").then($gallery => {
            const gallery = $gallery[0];
            expect(gallery.scrollWidth).to.be.greaterThan(gallery.clientWidth);
            gallery.scrollLeft = gallery.scrollWidth;
            expect(gallery.scrollLeft).to.be.greaterThan(0);
        });
    });
});

describe("Phase 1E — Works popup", () => {
    beforeEach(() => {
        cy.viewport(1280, 844);
        cy.visit("/work");
        waitForRenderedApp();
        cy.get("#work .image-popup").should("have.length", 2);
    });
    const open = () => cy.get("#work .image-popup").first().click({ force: true });
    it("delivers trusted native Enter activation to a plain control button", () => {
        cy.document().then(doc => {
            const control = doc.createElement("button");
            control.id = "native-enter-control";
            control.textContent = "Keyboard control";
            control.style.cssText = "position:fixed;top:100px;left:8px;z-index:20000";
            control.addEventListener("click", event => control.dataset.trustedClick = String(event.isTrusted));
            doc.body.appendChild(control);
        });
        cy.get("#native-enter-control").focus().should("have.focus");
        pressNativeEnter();
        cy.get("#native-enter-control").should("have.attr", "data-trusted-click", "true");
    });
    it("provides an accessible opener name", () => {
        cy.get("#work .image-popup").first().then($opener => {
            const opener = $opener[0];
            expect(opener.getAttribute("aria-label") || opener.textContent?.trim(), "accessible name").to.be.ok;
        });
    });
    it("reaches and opens the first popup with the keyboard", () => {
        cy.get('[data-custom-id="contact"]').focus();
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get("#work .image-popup").first().should("have.focus");
        pressNativeEnter();
        cy.get(".popup-image").should("be.visible");
    });
    it("provides a reachable close control", () => {
        open();
        cy.get(".cdk-overlay-pane").find("button, [role=button]").should("exist");
    });
    it("dismisses with Escape", () => {
        open();
        cy.get(".popup-image").should("be.visible");
        cy.press(Cypress.Keyboard.Keys.ESC);
        cy.get(".popup-image").should("not.exist");
    });
    it("dismisses on backdrop and restores opener focus", () => {
        open();
        cy.get(".cdk-overlay-backdrop").click({ force: true });
        cy.get(".popup-image").should("not.exist");
        cy.get("#work .image-popup").first().should("have.focus");
    });
    it("disposes the pane and backdrop on route destruction", () => {
        open();
        cy.get(".popup-image").should("be.visible");
        cy.document().then(originalDocument => {
            // About is absent from /work, so this component handler uses the Angular router.
            cy.get('[data-custom-id="about"]').then($link => $link[0].click());
            cy.location("pathname").should("eq", "/about");
            cy.get("#work").should("not.exist");
            cy.document().should(currentDocument => expect(currentDocument).to.equal(originalDocument));
            cy.get(".cdk-overlay-pane, .cdk-overlay-backdrop").should("not.exist");
        });
    });
});
