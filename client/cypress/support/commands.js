
// -- Login  command --
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
    cy.get('#username').type("user1")
    cy.get('#password').type("password")
    cy.get('#submit').click()
    cy.wait('@loginCall')
})
