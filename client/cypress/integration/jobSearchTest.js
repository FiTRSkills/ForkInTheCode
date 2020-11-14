describe("Job Search", () => {
  it("Add Skill- SUCCESS", () => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/JobSearch");
    cy.get("#navBarTitle").should("contain", "Job Search");
    cy.get("#skillInput").type("developer");
    cy.get("#addSkill").click();
    cy.get("#skillList").should("contain", "developer");
  });
  it("Add Duplicate Skill- FAILURE", () => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/JobSearch");
    cy.get("#navBarTitle").should("contain", "Job Search");
    cy.get("#skillInput").type("developer");
    cy.get("#addSkill").click();
    cy.get("#skillInput").type("developer");
    cy.get("#addSkill").click();
    cy.get("#skillList").should("not.have.value", "developer");
  });

  it("Job Results Returned- SUCCESS", () => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/JobSearch");
    cy.server();
    cy.route({
          method: "POST",
          url: Cypress.env("REACT_APP_SERVER_URL") + "/JobSearch",
          status: 200,
          response: [{
              _id: "1234",
              organization: { "_id": 123, "name": "Apple" },
              jobTitle: "IT Admin",
              pay: "$123",
              code: "1223",
              description: "This is a description",
              qualifications: "qualification",
              skills: [{ "name": "Networking" }, { "name": "IT" }]
            }]
        }).as("submitSearch");
    cy.get("#navBarTitle").should("contain", "Job Search");
    cy.get("#zipcode").type("1234");
    cy.get("#submit").click();
    cy.wait("@submitSearch").its("status").should("eq", 200);
    cy.contains("IT Admin");
    cy.contains("This is a description");
    cy.contains("Networking");
    cy.contains("Apple");
  });
  it("0 Results returned - SUCCESS", () => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/JobSearch");
    cy.server();
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/JobSearch",
      status: 200,
      response: []
    }).as("submitSearch");
    cy.get("#navBarTitle").should("contain", "Job Search");
    cy.get("#zipcode").type("1234");
    cy.get("#submit").click();
    cy.wait("@submitSearch").its("status").should("eq", 200);
    cy.contains("No Results");
  });
  it("Job Results 401- FAILURE", () => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/JobSearch");
    cy.server();
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/JobSearch",
      status: 401,
      response: []
    }).as("submitSearch");
    cy.get("#navBarTitle").should("contain", "Job Search");
    cy.get("#zipcode").type("1234");
    cy.get("#submit").click();
    cy.wait("@submitSearch").its("status").should("eq", 401);
    cy.contains("Please Try Again");
  });
  it("Attempt Job Search No Zipcode- FAILURE", () => {
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/JobSearch");
    cy.server();
    cy.get("#navBarTitle").should("contain", "Job Search");
    cy.get("#submit").click();
    cy.should("not.have.value", "results");
  });
  it("Retrieve Profile Skills- SUCCESS", () => {
    cy.server();
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response:{
        skills: [{"name": "dev"},{"name": "hardware"}]}
    }).as("getProfileSkills");
    cy.fakeLogin();
    cy.get("#navBarTitle").should("contain", "Job Search");
    cy.wait("@getProfileSkills").its("status").should("eq", 200);
    cy.contains("hardware");
    cy.contains("dev");
  });
  it("Retrieve Profile Skills 401- FAILURE", () => {
    cy.server();
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 401,
      response:[]
    }).as("getProfileSkills");
    cy.fakeLogin();
    cy.get("#navBarTitle").should("contain", "Job Search");
    cy.wait("@getProfileSkills").its("status").should("eq", 401);
    cy.get("#skillInput").should("not.have.value", "dev");
  });
  it("Click Job Posting - SUCCESS", () => {
    cy.server();
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/JobSearch",
      status: 200,
      response: [{
        _id: "1234",
        organization: { "_id": 123, "name": "Apple" },
        jobTitle: "IT Admin",
        pay: "$123",
        code: "1223",
        description: "This is a description",
        qualifications: "qualification",
        skills: [{ "name": "Networking" }, { "name": "IT" }]
      }]
    }).as("submitSearch");
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response:{
        skills: [{"name": "dev"},{"name": "hardware"}]}
    }).as("getProfileSkills");
    cy.fakeLogin();
    cy.get("#navBarTitle").should("contain", "Job Search");
    cy.wait("@getProfileSkills").its("status").should("eq", 200);
    cy.get("#zipcode").type("1234");
    cy.get("#submit").click();
    cy.wait("@submitSearch").its("status").should("eq", 200);
    cy.get("#results > a").click();
    cy.url().should("contain", "1234");
  });
});
