/* @agent Read: .agents/skills/portfolio-verification/SKILL.md; .agents/skills/portfolio-design/SKILL.md
Policy: README.md#behavioral-contracts; docs/STYLESHEET_REFINEMENT_PLAN.md
Implementation: src/app/home/selected-research/selected-research.component.ts; src/app/shared/image-popup.ts
Native keyboard control: cypress/support/native-keyboard.ts */
import { pressNativeEnter } from '../support/native-keyboard';

describe('Selected Research image previews', () => {
    beforeEach(() => cy.intercept('GET', '/feed', []));

    for (const width of [360, 390, 1280]) {
        for (const route of ['/home', '/research']) {
            it(`opens every image with attribution and contained geometry on ${route} at ${width}px`, () => {
                cy.viewport(width, 844);
                cy.visit(route);
                cy.get('.research-image-preview').should('have.length', 5).each($opener => {
                    const image = $opener.find('img')[0];
                    const caption = $opener.parent().find('figcaption').text();
                    cy.wrap($opener).click();
                    cy.get('[role="dialog"]').should('be.visible').and('have.attr', 'aria-modal', 'true');
                    cy.get('.popup-image').should('have.attr', 'src', image.getAttribute('src'))
                        .and('have.attr', 'alt', image.getAttribute('alt'));
                    cy.get('.popup-image').should($image => {
                        expect(($image[0] as HTMLImageElement).naturalWidth, 'preview asset loads').to.be.greaterThan(0);
                    });
                    cy.get('[role="dialog"] figcaption').should('have.text', caption);
                    cy.get('.popup-close').should('have.focus').and('be.visible');
                    cy.document().should(doc => expect(doc.documentElement.scrollWidth, 'document width while preview is open').to.be.at.most(doc.documentElement.clientWidth + 1));
                    cy.get('[role="dialog"]').should($dialog => {
                        const rect = $dialog[0].getBoundingClientRect();
                        expect(rect.left).to.be.at.least(0);
                        expect(rect.right).to.be.at.most(width);
                        expect(rect.top).to.be.at.least(0);
                        expect(rect.bottom).to.be.at.most(845);
                    });
                    if (route === '/research' && image.getAttribute('alt')?.startsWith('UPIGAN') && width !== 390) {
                        cy.screenshot(`research-popup-${width}`, { capture: 'viewport' });
                    }
                    cy.get('.popup-close').click();
                    cy.get('[role="dialog"]').should('not.exist');
                    cy.wrap($opener).should('have.focus');
                    cy.document().should(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth + 1));
                });
            });
        }
    }

    it('opens from native Enter, dismisses with Escape and restores focus', () => {
        cy.visit('/research');
        cy.get('.research-image-preview').first().focus();
        pressNativeEnter();
        cy.get('.popup-close').should('have.focus');
        cy.press(Cypress.Keyboard.Keys.ESC);
        cy.get('[role="dialog"]').should('not.exist');
        cy.get('.research-image-preview').first().should('have.focus');
    });

    it('closes from the backdrop and can reopen another image', () => {
        cy.visit('/research');
        cy.get('.research-image-preview').first().click();
        cy.get('.popup-image').should('be.visible');
        cy.get('.cdk-overlay-backdrop').click({ force: true });
        cy.get('[role="dialog"]').should('not.exist');
        cy.get('.research-image-preview').first().should('have.focus');
        cy.get('.research-image-preview').last().click();
        cy.get('[role="dialog"]').should('have.length', 1);
        cy.get('.popup-image').should('have.attr', 'alt', 'Map901 project banner');
    });

    it('disposes the overlay during genuine SPA navigation', () => {
        cy.visit('/research');
        cy.get('.research-image-preview').first().click();
        cy.get('.popup-image').should('be.visible');
        cy.document().then(original => {
            cy.get('[data-custom-id="about"]').then($link => $link[0].click());
            cy.location('pathname').should('eq', '/about');
            cy.document().should(current => expect(current).to.equal(original));
            cy.get('app-selected-research, .cdk-overlay-pane, .cdk-overlay-backdrop, .cdk-focus-trap-anchor').should('not.exist');
        });
    });
});
