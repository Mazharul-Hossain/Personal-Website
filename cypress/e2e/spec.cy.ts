describe("Portfolio smoke tests", () => {
    function expectSectionBelowNavigation(section: string): void {
        cy.get(`#${section} h2`).should($heading => {
            const heading = $heading[0].getBoundingClientRect();
            const navigation = $heading[0].ownerDocument.querySelector('.navigation')!.getBoundingClientRect();
            const viewportHeight = $heading[0].ownerDocument.defaultView!.innerHeight;

            expect(heading.top, 'heading is below the navigation').to.be.at.least(navigation.bottom);
            expect(heading.bottom, 'heading is visible in the viewport').to.be.at.most(viewportHeight);
        });
    }

    it('keeps hero and navbar motion enabled with reduced motion and exposes accessible icon links', () => {
        cy.intercept('GET', '/feed', []);
        cy.visit('/', {
            onBeforeLoad(win) {
                const originalMatchMedia = win.matchMedia.bind(win);
                cy.stub(win, 'matchMedia').callsFake((query: string) => {
                    const result = originalMatchMedia(query);
                    if (query === '(prefers-reduced-motion: reduce)') {
                        Object.defineProperty(result, 'matches', { value: true });
                    }
                    return result;
                });
            }
        });
        cy.get('.header-social-icon a, .footer-content ul a, .back-to-top').each($link => {
            expect($link.attr('aria-label')).to.be.a('string').and.not.be.empty;
        });
        cy.get('.header-social-icon a').first().focus().should('have.css', 'outline-style', 'solid');
        cy.get('.header-shape img').each($image => expect($image.attr('alt')).to.eq(''));
        cy.get('#parallax .layer').first().should($layer => {
            expect($layer[0].style.transform, 'parallax library initialized').to.contain('translate');
        });
        // The library waits up to 500 ms before falling back from device orientation to mouse input.
        cy.wait(700);
        cy.get('#parallax .layer').first().then($layer => {
            const before = $layer[0].style.transform;
            cy.window().trigger('mousemove', { clientX: 10, clientY: 10 });
            cy.get('#parallax .layer').first().should($updated => {
                expect($updated[0].style.transform, 'shape moves with the pointer').not.to.eq(before);
            });
        });
        cy.window().then(win => cy.spy(win, 'scrollTo').as('animatedScroll'));
        cy.get('.navigation [data-custom-id="experience"]').click();
        cy.location('pathname').should('eq', '/experience');
        cy.get('#home').should('exist');
        cy.get('@animatedScroll').should(spy => expect((spy as unknown as sinon.SinonSpy).callCount).to.be.greaterThan(2));
        expectSectionBelowNavigation('experience');
        cy.wait(1100); // Let the one-second navbar animation finish before testing the return trip.
        cy.get('@animatedScroll').then(spy => (spy as unknown as sinon.SinonSpy).resetHistory());
        cy.get('.back-to-top').should('be.visible').click();
        cy.get('@animatedScroll').should(spy => expect((spy as unknown as sinon.SinonSpy).callCount).to.be.greaterThan(2));
        cy.window().its('scrollY').should('eq', 0);
    });

    it('lets the latest navigation or back-to-top click take control of scrolling', () => {
        cy.intercept('GET', '/feed', []);
        cy.visit('/');
        cy.scrollTo(0, 1200, { duration: 0 });
        cy.get('.back-to-top').should('be.visible').click();
        cy.wait(200);
        cy.get('.navigation [data-custom-id="experience"]').click();
        cy.wait(1700);
        expectSectionBelowNavigation('experience');

        cy.get('.navigation [data-custom-id="research"]').click();
        cy.wait(200);
        cy.get('.back-to-top').should('be.visible').click();
        cy.wait(1700);
        cy.window().its('scrollY').should('eq', 0);
    });

    for (const section of ['research', 'experience']) {
        it(`opens ${section} from another page and survives refresh on mobile`, () => {
            cy.intercept('GET', '/feed', []);
            cy.viewport(390, 844);
            cy.visit('/publications');
            cy.get('.navbar-toggler').click();
            cy.get(`.navigation [data-custom-id="${section}"]`).click();
            cy.location('pathname').should('eq', `/${section}`);
            cy.get(`#${section}`).should('be.visible');
            cy.get('#home').should('not.exist');
            cy.get(section === 'research' ? '#experience' : '#research').should('not.exist');
            if (section === 'research') cy.get('#selected-research').should('be.visible');
            expectSectionBelowNavigation(section);
            cy.get('.navbar-toggler').should('have.attr', 'aria-expanded', 'false');
            cy.reload();
            expectSectionBelowNavigation(section);
            cy.get('#home').should('not.exist');
        });
    }

    it('shows three preview posts and every feed post in the local Writing archive', () => {
        const posts = Array.from({ length: 6 }, (_, i) => ({ title: `Article ${i}`, link: `https://example.com/${i}`, description: 'Summary' }));
        cy.intercept('GET', '/feed', posts);
        cy.visit('/');
        cy.get('.writing-post').should('have.length', 3);
        cy.get('.writing-link').click();
        cy.location('pathname').should('eq', '/blog');
        cy.get('.writing-post').should('have.length', 6);
        cy.get('link[rel="canonical"]').should('have.attr', 'href', 'https://www.hmazharul.com/blog');
        cy.get('meta[name="description"]').should('have.length', 1);
    });

    it("renders the homepage identity and primary sections", () => {
        cy.intercept("GET", "/feed", []);
        cy.visit("/");

        cy.get("h1").should("contain.text", "Mazharul Hossain");
        cy.get("#publications").should("be.visible");
        cy.get("#selected-research").should("be.visible");
        cy.get("#publications .publication-list li").should("have.length", 5);
        cy.get('#publications a[href="/publications"]').should("contain.text", "View all publications");
        cy.get("#about").should("exist");
        cy.get("#about").should("contain.text", "TODO:<ADD TRUE DETAILS>");
        cy.get("#contact").should("exist");
    });

    for (const section of ['research', 'publications', 'experience', 'about', 'blog', 'contact']) {
        it(`scrolls to ${section} on the homepage and opens its page on reload`, () => {
            cy.intercept('GET', '/feed', []);
            cy.visit('/home');
            cy.get(`.navigation [data-custom-id="${section}"]`).click();
            cy.location('pathname').should('eq', `/${section}`);
            cy.get('#home').should('exist');
            expectSectionBelowNavigation(section);
            cy.reload();
            cy.get('#home').should('not.exist');
            cy.get(`#${section}`).should('exist');
        });
    }

    it('shows the About heading below navigation on the standalone page', () => {
        cy.visit('/about');
        cy.contains('#about h2', 'About Me').should('be.visible');
        expectSectionBelowNavigation('about');
        cy.reload();
        expectSectionBelowNavigation('about');
    });

    for (const viewport of [[1280, 720], [390, 844]]) {
        it(`shows the Writing heading below navigation at ${viewport[0]}px`, () => {
            cy.intercept('GET', '/feed', []);
            cy.viewport(viewport[0], viewport[1]);
            cy.visit('/blog');
            expectSectionBelowNavigation('blog');
            cy.reload();
            expectSectionBelowNavigation('blog');
        });

        it(`shows the Contact heading below navigation at ${viewport[0]}px`, () => {
            cy.viewport(viewport[0], viewport[1]);
            cy.visit('/contact');
            expectSectionBelowNavigation('contact');
            cy.reload();
            expectSectionBelowNavigation('contact');
        });
    }

    it("marks About active when scrolling on the homepage", () => {
        cy.intercept("GET", "/feed", []);
        cy.visit("/");
        cy.get('.navigation [data-custom-id="about"]').click();
        cy.location("pathname").should("eq", "/about");
        cy.get('.navigation [data-custom-id="about"]').parent().should("have.class", "active");
        cy.get('.navigation [data-custom-id="home"]').parent().should("not.have.class", "active");
        cy.get('#home').should('exist');
        expectSectionBelowNavigation('about');
    });

    it("uses the Blog route from the Writing navigation item", () => {
        cy.intercept("GET", "/feed", []);
        cy.visit("/");
        cy.get('.navigation [data-custom-id="blog"]').click();
        cy.location("pathname").should("eq", "/blog");
        cy.contains("h2", "Notes on research, engineering, and learning").should("be.visible");
    });

    it("opens the standalone publications route", () => {
        cy.intercept("GET", "/feed", []);
        cy.visit("/");
        cy.get("#publications").scrollIntoView();
        cy.window().its("scrollY").should("be.greaterThan", 0);
        cy.get('#publications a[href="/publications"]').click();

        cy.location("pathname").should("eq", "/publications");
        cy.window().its("scrollY").should("eq", 0);
        cy.contains("h2", "My Research Publications").should("be.visible");
        cy.get('a[href*="scholar.google.com"]').should("have.attr", "target", "_blank");
    });
});
