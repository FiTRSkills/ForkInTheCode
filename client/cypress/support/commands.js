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
    cy.visit('/Login');
    cy.server()
    cy.route({
        method: 'POST',
        url: 'http://localhost:9000/Login',
        status: 200,
        response: {
            user: { id: 1 }
        }
    }).as('loginCall')
    cy.get('#email').type("email@email.com")
    cy.get('#password').type("password")
    cy.get('#submit').click()
    cy.wait('@loginCall')
})
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
