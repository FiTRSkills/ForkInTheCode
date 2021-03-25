describe("Authentication", () => {
  // beforeEach(()=>{
  //   cy.task("adduser:db")
  // })
  it("Logs in", () => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/Login");
    cy.get("#navBarTitle").should("contain", "Login");
    cy.get("#email").type("hello@rit.edu");
    cy.get("#password").type("1234");
    cy.intercept('POST', '/Login').as("loginCall");
    cy.get("#submit").click();
    cy.wait("@loginCall").its("response.statusCode").should("eq", 200);
    cy.get("#navBarTitle").should("contain", "Job Search");
  });

});
