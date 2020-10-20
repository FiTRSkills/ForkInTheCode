describe('Authentication', () => {
    it('Logs in', () => {
        cy.visit('/Login');
        cy.get("#navBarTitle").should('contain', 'Login')
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
        cy.wait('@loginCall').its('status').should('eq', 200)
        cy.get("#navBarTitle").should('contain', 'Home')
    })

    it('Fails to log in', () => {
        cy.visit('/Login');
        cy.get("#navBarTitle").should('contain', 'Login')
        cy.server()
        cy.route({
            method: 'POST',
            url: 'http://localhost:9000/Login',
            status: 401,
            response: {}
        }).as('apiCall')
        cy.get('#email').type("email@email.com")
        cy.get('#password').type("password")
        cy.get('#submit').click()
        cy.wait('@apiCall').its('status').should('not.eq', 200)
        cy.contains('Your Username and/or Password was incorrect, please try again.')
    })

    it('Logs Out', () => {
        cy.fakeLogin()
        cy.get('#SignOut').click()
        cy.get("#navBarTitle").should('contain', 'Login')
    })
})