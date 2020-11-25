describe("Authentication", () => {
  it("Logs in", () => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/Login");
    cy.server();
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Login",
      status: 200,
      response: "JobSeekerProfile",
    }).as("loginCall");
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/usertype",
      status: 200,
      response: "",
    }).as("userTypeCall");
    cy.get("#navBarTitle").should("contain", "Login");
    cy.get("#email").type("email@email.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();
    cy.wait("@loginCall").its("status").should("eq", 200);
    cy.get("#navBarTitle").should("contain", "Job Search");
  });

  it("Fails to log in", () => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/Login");
    cy.get("#navBarTitle").should("contain", "Login");
    cy.server();
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Login",
      status: 401,
      response: {},
    }).as("apiCall");
    cy.get("#email").type("email@email.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();
    cy.wait("@apiCall").its("status").should("not.eq", 200);
    cy.contains("Your Email and/or Password was incorrect, please try again.");
  });

  it("Logs Out", () => {
    cy.fakeLogin();
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/usertype",
      status: 200,
      response: "",
    }).as("userTypeCall");
    cy.get("#SignOut").click();
    cy.get("#navBarTitle").should("contain", "Login");
  });
});
