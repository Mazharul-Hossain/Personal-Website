describe("Portfolio smoke tests", () => {
    it("renders the homepage identity and primary sections", () => {
        cy.intercept("GET", "/feed", []);
        cy.visit("/");

        cy.get("h1").should("contain.text", "Mazharul Hossain");
        cy.get("#publications").should("be.visible");
        cy.get("#publications .publication-list li").should("have.length", 6);
        cy.get('#publications a[href="/publications"]').should("contain.text", "View all publications");
        cy.get("#about").should("exist");
        cy.get("#contact").should("exist");
    });

    it("scrolls to research from the navigation", () => {
        cy.intercept("GET", "/feed", []);
        cy.visit("/");
        cy.get('.navigation [data-custom-id="research"]').click();
        cy.window().its("scrollY").should("be.greaterThan", 0);
        cy.get('.navigation [data-custom-id="research"]').parent().should("have.class", "active");
        cy.get("#research h2").should("contain.text", "My Research");
    });

    it("updates the active navigation item when scrolling to About", () => {
        cy.intercept("GET", "/feed", []);
        cy.visit("/");
        cy.get('.navigation [data-custom-id="about"]').click();
        cy.location("pathname").should("eq", "/");
        cy.location("hash").should("eq", "#about");
        cy.get('.navigation [data-custom-id="about"]').parent().should("have.class", "active");
        cy.get('.navigation [data-custom-id="home"]').parent().should("not.have.class", "active");
        cy.wait(1100);
        cy.get("#research").scrollIntoView();
        cy.get('.navigation [data-custom-id="research"]').parent().should("have.class", "active");
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
