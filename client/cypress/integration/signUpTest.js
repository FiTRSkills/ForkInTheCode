describe("Sign Up", () => {
  it("Sign Up Job Seeker Success", () => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/SignUp");
    cy.get("#navBarTitle").should("contain", "Sign Up");
    cy.server();
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/register",
      status: 200,
      response: {
        data: "Successfully created user",
      },
    }).as("signUpCall");
    cy.get("#simple-tabpanel-0 form #email").type("email@email.com");
    cy.get("#simple-tabpanel-0 form #password").type("password");
    cy.get("#simple-tabpanel-0 form #submit").click();
    cy.wait("@signUpCall").its("status").should("eq", 200);
    cy.get("#navBarTitle").should("contain", "Login");
  });

  it("Sign Up Job Seeker Fails", () => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/SignUp");
    cy.get("#navBarTitle").should("contain", "Sign Up");
    cy.server();
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/register",
      status: 400,
      response: {
        name: "UserExistsError",
        message: "A user with the given username is already registered",
      },
    }).as("signUpCall");
    cy.get("#simple-tabpanel-0 form #email").type("email@email.com");
    cy.get("#simple-tabpanel-0 form #password").type("password");
    cy.get("#simple-tabpanel-0 form #submit").click();
    cy.wait("@signUpCall").its("status").should("eq", 400);
    cy.contains("A user with the given username is already registered");
  });

  it("Sign Up Employer Success", () => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/SignUp");
    cy.get("#navBarTitle").should("contain", "Sign Up");
    cy.server();
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/register",
      status: 200,
      response: {
        data: "Successfully created user",
      },
    }).as("signUpCall");
    cy.get("#employerTab").click();
    cy.get("#simple-tabpanel-1 form #email").type("email@email.com");
    cy.get("#simple-tabpanel-1 form #password").type("password");
    cy.get("#simple-tabpanel-1 form #organization").type("organization");
    cy.get("#simple-tabpanel-1 form #submit").click();
    cy.wait("@signUpCall").its("status").should("eq", 200);
    cy.get("#navBarTitle").should("contain", "Login");
  });

  it("Sign Up Employer Fails", () => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/SignUp");
    cy.get("#navBarTitle").should("contain", "Sign Up");
    cy.server();
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/register",
      status: 400,
      response: {
        name: "UserExistsError",
        message: "A user with the given username is already registered",
      },
    }).as("signUpCall");
    cy.get("#employerTab").click();
    cy.get("#simple-tabpanel-1 form #email").type("email@email.com");
    cy.get("#simple-tabpanel-1 form #password").type("password");
    cy.get("#simple-tabpanel-1 form #organization").type("organization");
    cy.get("#simple-tabpanel-1 form #submit").click();
    cy.wait("@signUpCall").its("status").should("eq", 400);
    cy.contains("A user with the given username is already registered");
  });

  it("Sign Up Educator Success", () => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/SignUp");
    cy.get("#navBarTitle").should("contain", "Sign Up");
    cy.server();
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/register",
      status: 200,
      response: {
        data: "Successfully created user",
      },
    }).as("signUpCall");
    cy.get("#educatorTab").click();
    cy.get("#simple-tabpanel-2 form #email").type("email@email.com");
    cy.get("#simple-tabpanel-2 form #password").type("password");
    cy.get("#simple-tabpanel-2 form #organization").type("organization");
    cy.get("#simple-tabpanel-2 form #submit").click();
    cy.wait("@signUpCall").its("status").should("eq", 200);
    cy.get("#navBarTitle").should("contain", "Login");
  });

  it("Sign Up Educator Fails", () => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/SignUp");
    cy.get("#navBarTitle").should("contain", "Sign Up");
    cy.server();
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/register",
      status: 400,
      response: {
        name: "UserExistsError",
        message: "A user with the given username is already registered",
      },
    }).as("signUpCall");
    cy.get("#educatorTab").click();
    cy.get("#simple-tabpanel-2 form #email").type("email@email.com");
    cy.get("#simple-tabpanel-2 form #password").type("password");
    cy.get("#simple-tabpanel-2 form #organization").type("organization");
    cy.get("#simple-tabpanel-2 form #submit").click();
    cy.wait("@signUpCall").its("status").should("eq", 400);
    cy.contains("A user with the given username is already registered");
  });
});
