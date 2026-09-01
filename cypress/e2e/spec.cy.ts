describe("Portfolio smoke tests", () => {
    it("renders the homepage identity and primary sections", () => {
        cy.intercept("GET", "/feed", []);
        cy.visit("/");

        cy.get("h1").should("contain.text", "Mazharul Hossain");
        cy.get("#publications").should("be.visible");
        cy.get("#about").should("exist");
        cy.get("#contact").should("exist");
    });

    it("opens the standalone publications route", () => {
        cy.visit("/publications");

        cy.location("pathname").should("eq", "/publications");
        cy.contains("h2", "My Research Publications").should("be.visible");
        cy.get('a[href*="scholar.google.com"]').should("have.attr", "target", "_blank");
    });
});
