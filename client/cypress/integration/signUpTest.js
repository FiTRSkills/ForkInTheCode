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
    cy.get("#job_seeker_form").within(($form) => {
      cy.get('input[name="username"]').type("test");
      cy.get('input[name="password"]').type("123456");
      cy.get('button[type="submit"]').click();
    });
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
      status: 400,
      response: {
        name: "UserExistsError",
        message: "A user with the given username is already registered",
      },
    }).as("signUpCall");
    cy.get("#job_seeker_form").within(($form) => {
      cy.get('input[name="username"]').type("test");
      cy.get('input[name="password"]').type("123");
      cy.get('button[type="submit"]').click();
    });
    cy.wait("@signUpCall").its("status").should("eq", 400);
    cy.contains("A user with the given username is already registered");
  });
});
