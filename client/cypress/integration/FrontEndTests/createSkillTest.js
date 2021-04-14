describe("View Courses", () => {
  beforeEach(() => {
    // Login first
    cy.fakeLogin("EducatorProfile");
  });

  it("Allow Creation SUCCESS", () => {
    cy.InitializeSkills(true, "/Course/Add");
    cy.get("#skillInput").type("hard");
    cy.contains("Create Skill");
    cy.get("body").should("not.contain", "Add Skill");
    cy.get("#skillInput").type("ware");
    cy.contains("Add Skill");
    cy.get("body").should("not.contain", "Create Skill");
    cy.get("#skillInput").type(" engineering");
    cy.contains("Create Skill");
    cy.get("body").should("contain", "Add Skill");
  });

  it("Create Skill SUCCESS", () => {
    cy.InitializeSkills(true, "/Course/Add");
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/skills/createSkill",
      status: 200,
      response: { _id: "4" },
    }).as("createSkill");
    cy.get("#skillInput").type("new skill");
    cy.get("#createSkill").click();
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/skills",
      status: 200,
      response: [
        { name: "developer", _id: "1" },
        { name: "hardware", _id: "2" },
        { name: "test", _id: "3" },
        { name: "new skill", _id: "4", description: "skill description" },
      ],
    }).as("getSkills");
    cy.get("#skillDescription").type("skill description");
    cy.get("#createSkillSubmit").click();
    cy.wait("@createSkill").its("status").should("eq", 200);
    cy.contains("new skill");
  });

  it("Create Skill FAILURE", () => {
    cy.InitializeSkills(true, "/Course/Add");
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/skills/createSkill",
      status: 400,
      response: "Error on skill creation.",
    }).as("createSkill");
    cy.get("#skillInput").type("new skill");
    cy.get("#createSkill").click();
    cy.get("#skillDescription").type("skill description");
    cy.get("#createSkillSubmit").click();
    cy.wait("@createSkill").its("status").should("eq", 400);
    cy.contains("Failed to create skill");
  });
});
