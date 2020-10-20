describe("Sign Up", () => {
  it("Sign Up Job Seeker Success", () => {
    cy.visit("/SignUp");
    cy.get("#navBarTitle").should("contain", "Sign Up");
    cy.server();
    cy.route({
      method: "POST",
      url: "http://localhost:9000/register",
      status: 200,
      response: {
        data: "Successfully created user",
      },
    }).as("signUpCall");
    cy.get('#simple-tabpanel-0 form #email').type("email@email.com")
    cy.get('#simple-tabpanel-0 form #password').type("password")
    cy.get('#simple-tabpanel-0 form #submit').click()
    cy.wait("@signUpCall").its("status").should("eq", 200);
    cy.get("#navBarTitle").should("contain", "Login");
  });

  it("Sign Up Job Seeker Fails", () => {
    cy.visit("/SignUp");
    cy.get("#navBarTitle").should("contain", "Sign Up");
    cy.server();
    cy.route({
      method: "POST",
      url: "http://localhost:9000/register",
      status: 200,
      response: {
        name: "UserExistsError",
        message: "A user with the given username is already registered",
      },
    }).as("signUpCall");
    cy.get('#simple-tabpanel-0 form #email').type("email@email.com")
    cy.get('#simple-tabpanel-0 form #password').type("password")
    cy.get('#simple-tabpanel-0 form #submit').click()
    cy.wait("@signUpCall").its("status").should("eq", 200);
    cy.contains("A user with the given username is already registered");
  });
});
