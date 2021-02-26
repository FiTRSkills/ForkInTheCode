describe("Skill Search", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/SkillSearch");
    cy.server();
  });

  it("Skill search by zip code SUCCESS", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/skills/search",
      status: 200,
      response: [
        { name: "PHP", numJobs: 10, id: 1 },
        { name: "MySQL", numJobs: 8, id: 2 },
      ],
    }).as("submitSearch");
    cy.get("#zipcode").type("14623");
    cy.get("#submit").click();
    cy.wait("@submitSearch").its("status").should("eq", 200);
  });

  it("Skill search by zip code FAILURE", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/skills/search",
      status: 400,
      response: "Bad request",
    }).as("submitSearch");
    cy.get("#zipcode").type("20000");
    cy.get("#submit").click();
    cy.wait("@submitSearch").its("status").should("eq", 400);
    cy.contains("Bad request");
  });

  it("Zip code not 5 digits FAILURE", () => {
    cy.get("#zipcode").type("111");
    cy.get("#submit").click();
    cy.contains("Must be a 5-digit zip code");
  });
});
