
describe("Authentication", () => {

  it("Logs in", () => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/Login");
    cy.get("#navBarTitle").should("contain", "Login");
    cy.get("#email").type("js1@g.com");
    cy.get("#password").type("pass");
    cy.intercept("POST", "/Login").as("loginCall");
    cy.get("#submit").click();
    cy.wait("@loginCall").its("response.statusCode").should("eq", 200);
    cy.get("#navBarTitle").should("contain", "Job Search");
  });
});