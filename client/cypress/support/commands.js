// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("fakeLogin", () => {
  cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/Login");
  cy.server();
  cy.route({
    method: "POST",
    url: Cypress.env("REACT_APP_SERVER_URL") + "/Login",
    status: 200,
    response: { type: "JobSeekerProfile" },
  }).as("loginCall");
  cy.get("#email").type("email@email.com");
  cy.get("#password").type("password");
  cy.get("#submit").click();
  cy.wait("@loginCall");
});

Cypress.Commands.add("fakeProfile", () => {
  // Stub get profile error response
  cy.route({
    method: "GET",
    url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
    status: 200,
    response: {
      firstname: "John",
      lastname: "Appleseed",
      dob: "1998-01-05",
      education: [
        {
          degree: "BS Software Engineering",
          major: "Software Engineering",
          organization: "RIT",
        },
      ],
      career: [
        {
          jobTitle: "Student",
          startDate: "2018-01-01",
          endDate: "2020-01-01",
          organization: "Apple",
        },
      ],
    },
  }).as("profileCall");

  // Go to profile. Verify profile loaded success.
  cy.get("#Profile").click();
  cy.wait("@profileCall").its("status").should("eq", 200);
  cy.get("p[name='firstName']").should("contain", "John");
});
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
