/* @agent Read: .agents/skills/portfolio-verification/SKILL.md; .agents/skills/portfolio-design/SKILL.md
Policy: README.md#behavioral-contracts; docs/STYLESHEET_REFINEMENT_PLAN.md
Implementation: src/app/home/selected-research/selected-research.component.html; src/app/home/selected-research/selected-research.component.css */
export {};

// Preserve the live site's study arrangement and visible card boundaries, not exact text heights.
for (const width of [360, 768, 1280]) {
    for (const route of ['/home', '/research']) {
        it(`preserves the live research grid on ${route} at ${width}px`, () => {
            cy.viewport(width, 900);
            cy.intercept('GET', '/feed', []);
            cy.visit(route);
            cy.get('.research-study-grid').should($grid => {
                const grid = $grid[0];
                const studies = Array.from(grid.querySelectorAll<HTMLElement>('.research-study'));
                expect(studies).to.have.length(3);
                expect(grid.querySelectorAll('.research-figure')).to.have.length(4);
                const [featured, microscopy, map] = studies.map(study => study.getBoundingClientRect());
                expect(featured.width).to.be.closeTo(grid.getBoundingClientRect().width, 1);
                if (width >= 768) {
                    expect(microscopy.top).to.be.closeTo(map.top, 1);
                    expect(microscopy.right).to.be.lessThan(map.left);
                    expect(microscopy.top).to.be.greaterThan(featured.bottom);
                    const figures = studies[0].querySelectorAll('.research-figure');
                    expect(figures[0].getBoundingClientRect().top).to.be.closeTo(figures[1].getBoundingClientRect().top, 1);
                } else {
                    expect(microscopy.top).to.be.greaterThan(featured.bottom);
                    expect(map.top).to.be.greaterThan(microscopy.bottom);
                    for (const study of studies) expect(study.getBoundingClientRect().width).to.be.closeTo(featured.width, 1);
                }
                for (const study of studies) {
                    const style = getComputedStyle(study);
                    for (const edge of ['Top', 'Right', 'Bottom', 'Left'] as const) {
                        expect(parseFloat(style[`border${edge}Width`]), `visible ${edge} study boundary`).to.be.greaterThan(0);
                        expect(style[`border${edge}Style`]).not.to.equal('none');
                    }
                }
            });
            cy.document().should(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth + 1));
        });
    }
}
