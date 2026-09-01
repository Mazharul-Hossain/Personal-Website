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
