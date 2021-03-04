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
    cy.get("#courseNumber1").should("contain", "TBD"); // TODO: update when course content is defined
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
