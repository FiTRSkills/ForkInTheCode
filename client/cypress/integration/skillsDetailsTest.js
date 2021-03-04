describe("Skills Details", () => {
  it("View Skill Details SUCCESS", () => {
    cy.server();
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/skills/getSkill?id=1",
      status: 200,
      response: {
        name: "programming",
        alias: ["program", "coding"],
        description: "this is programming's description",
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
        ], // This is not totally defined at the time of writing this
      },
    }).as("getSkill");
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/SkillDetails/1");
    cy.wait("@getSkill").its("status").should("eq", 200);
    cy.get("#name").should("contain", "programming");
    cy.get("#aliases").should("contain", "program, coding");
    cy.get("#description").should(
      "contain",
      "this is programming's description"
    );
    cy.get("#courseNumber1").should("contain", "Programming 101");
    cy.get("#courseNumber2").should("contain", "Intro to Software");
  });

  it("View Skill Details INVALID SKILL", () => {
    cy.server();
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/skills/getSkill?id=1",
      status: 406,
      response: "Invalid Skill",
    }).as("getSkill");
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/SkillDetails/1");
    cy.wait("@getSkill").its("status").should("eq", 406);
    cy.get("#error").should("contain", "Invalid Skill Id");
  });
});
