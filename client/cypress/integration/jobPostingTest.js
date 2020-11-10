describe("Job Posting", () => {
  it("Load job posting success", () => {
    // Stub edit profile success response
    cy.server();
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobposting?id=30",
      status: 200,
      response: {
        organization: {
          name: "Amazon",
          location: "USA",
          contact: {
            address: "Silicon Valley",
            email: "amazon@gmail.com",
            phone: "0111222333",
          },
        },
        jobTitle: "Software Engineer",
        pay: "$12000",
        code: 14623,
        description: "Very difficult job",
        qualifications: "Good coder",
      },
    }).as("jobPostingCall");

    // Verify load job posting success
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/JobPost/30");
    cy.wait("@jobPostingCall").its("status").should("eq", 200);
    cy.contains("Good coder");
  });

  it("Load job posting failure", () => {
    // Stub edit profile success response
    cy.server();
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobposting?id=30",
      status: 400,
      response: "Bad request",
    }).as("jobPostingCall");

    // Verify load job posting success
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/JobPost/30");
    cy.wait("@jobPostingCall").its("status").should("eq", 400);
    cy.contains("Bad request");
  });
});
