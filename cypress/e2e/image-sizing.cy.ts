/* @agent Read: .agents/skills/portfolio-verification/SKILL.md; .agents/skills/portfolio-design/SKILL.md
Policy: README.md#behavioral-contracts; docs/STYLESHEET_REFINEMENT_PLAN.md
Implementation: src/app/index-page/index-page.component.html; src/app/home/selected-research/selected-research.component.html; src/assets/css/style.css */
export {};

for (const width of [360, 390, 1280]) {
    describe(`Local image geometry at ${width}px`, () => {
        beforeEach(() => {
            cy.viewport(width, 844);
            cy.intercept('GET', '/feed', []);
        });

        it('reserves local image proportions even when the image network fails', () => {
            cy.intercept('GET', '**/assets/images/**', { forceNetworkError: true });
            cy.visit('/home');
            cy.get('.preloader').should('have.class', 'is-hidden');
            cy.get('img[src^="assets/images/"]').each($image => {
                const image = $image[0] as HTMLImageElement;
                expect(Number(image.getAttribute('width')), image.src + ' width').to.be.greaterThan(0);
                expect(Number(image.getAttribute('height')), image.src + ' height').to.be.greaterThan(0);
                const portrait = image.closest('.header-image');
                if (image.closest('.header-shape, .navbar-brand, .footer-content') || (portrait && getComputedStyle(portrait).display !== 'none')) {
                    cy.wrap($image).scrollIntoView().should($element => {
                        const rect = $element[0].getBoundingClientRect();
                        expect(rect.width, image.src).to.be.greaterThan(0);
                        const ratio = Number(image.getAttribute('height')) / Number(image.getAttribute('width'));
                        expect(rect.height, image.src).to.be.closeTo(rect.width * ratio, 1);
                    });
                }
            });
            cy.document().should(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth + 1));
        });

        it('preserves loaded image proportions and the research figure frames', () => {
            cy.visit('/home');
            cy.get('.preloader').should('have.class', 'is-hidden');
            cy.get('img[src^="assets/images/"]').each($image => {
                const image = $image[0] as HTMLImageElement;
                if (getComputedStyle(image.closest('.header-image') || image).display === 'none') return;
                cy.wrap($image).scrollIntoView().should(() => {
                    expect(image.naturalWidth, image.src).to.be.greaterThan(0);
                    const declaredWidth = Number(image.getAttribute('width'));
                    const declaredHeight = Number(image.getAttribute('height'));
                    expect(declaredWidth, image.src).to.equal(image.naturalWidth);
                    expect(declaredHeight, image.src).to.equal(image.naturalHeight);
                    const rect = image.getBoundingClientRect();
                    if (image.closest('.research-figure')) expect(rect.height).to.equal(220);
                    else expect(rect.height / rect.width, image.src).to.be.closeTo(image.naturalHeight / image.naturalWidth, 0.01);
                });
            });
        });

    });
}
