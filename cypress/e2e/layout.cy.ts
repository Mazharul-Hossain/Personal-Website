/* @agent Read: .agents/skills/portfolio-verification/SKILL.md; .agents/skills/portfolio-design/SKILL.md
Policy: README.md#behavioral-contracts; docs/BUNDLE_OPTIMIZATION_PLAN.md
Implementation: src/app/home/selected-research/selected-research.component.ts; src/app/home/selected-research/selected-research.component.html; global order: angular.json */
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
        for (const route of ["/home", "/research", "/publications"]) {
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
                        return rect.width && (rect.right > viewport + 1 || rect.left < -1);
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
});
