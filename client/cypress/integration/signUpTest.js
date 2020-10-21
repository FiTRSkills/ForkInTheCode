describe("Sign Up", () => {
  it("Sign Up Job Seeker Success", () => {
    // Navigate to sign up page and verify current page is sign up
    cy.visit("/SignUp");
    cy.get("#navBarTitle").should("contain", "Sign Up");

    // Mock a server and stub success response
    cy.server();
    cy.route({
      method: "POST",
      url: "http://localhost:9000/register",
      status: 200,
      response: {
        data: "Successfully created user",
      },
    }).as("signUpCall");

    // Fill in the sign up form and submit
    cy.get("#job_seeker_form").within(($form) => {
      cy.get('input[name="email"]').type("test");
      cy.get('input[name="password"]').type("123456");
      cy.get('button[type="submit"]').click();
    });

    // Verify response is success and redirect to login
    cy.wait("@signUpCall").its("status").should("eq", 200);
    cy.get("#navBarTitle").should("contain", "Login");
  });

  it("Sign Up Job Seeker Fails", () => {
    // Navigate to sign up page and verify current page is sign up
    cy.visit("/SignUp");
    cy.get("#navBarTitle").should("contain", "Sign Up");

    // Mock a server and stub error response
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

    // Fill in the sign up form and submit
    cy.get("#job_seeker_form").within(($form) => {
      cy.get('input[name="email"]').type("test");
      cy.get('input[name="password"]').type("123");
      cy.get('button[type="submit"]').click();
    });

    // Verify response is error
    cy.wait("@signUpCall").its("status").should("eq", 400);
    cy.contains("A user with the given username is already registered");
  });
});
