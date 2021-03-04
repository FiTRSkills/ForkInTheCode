describe("Job Posting", () => {
  it("Load job posting success", () => {
    // Stub edit profile success response
    cy.server();
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobs/jobposting?id=30",
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
        skills: [{ name: "Python" }, { name: "SQL" }],
        courses: [
          {
            id: 1,
            name:"Programming 101",
            description: "This a wonderful class taught by yours truly. Wonderful absolutely wonderful. Will learn everything about programming and even build your own site so you can become the next Bill Gates",
            skills: [{ "name": "Networking", "_id":1 }, { "name": "IT","_id":2 }]
          },
          {
            id: 2,
            name:"Intro to Software",
            description: "Have you ever wanted to become a millionaire. This is the class you need to take.",
            skills: [{ "name": "Fast Typing", "_id":3 }, { "name": "Programming","_id":4 }]
          },
        ]
      },
    }).as("jobPostingCall");

    // Verify load job posting success
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/JobPost/30");
    cy.wait("@jobPostingCall").its("status").should("eq", 200);
    cy.contains("Good coder");
    cy.contains("Python");
  });

  it("Load job posting failure", () => {
    // Stub edit profile success response
    cy.server();
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobs/jobposting?id=30",
      status: 400,
      response: "Bad request",
    }).as("jobPostingCall");

    // Verify load job posting success
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/JobPost/30");
    cy.wait("@jobPostingCall").its("status").should("eq", 400);
    cy.contains("Bad request");
  });
});
