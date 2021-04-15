describe("Load skills profile", () => {
  it("Load skills success", () => {
    cy.fakeProfile();
    cy.wait("@profileCall").its("status").should("eq", 200);
    cy.get("#skillList").contains("skill1");
    cy.get("#skillList").contains("skill2");
    cy.get("#skillList").contains("skill3");
  });

  it("Load skills failure", () => {
    cy.fakeProfile(false);
    // Go to profile. Verify profile loaded failed.
    cy.wait("@profileCall").its("status").should("eq", 400);
    cy.contains("Access denied");
  });

  it("Add skill success", () => {
    cy.fakeProfile();
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/skills",
      status: 200,
      response: [
        { name: "dev", _id: "1" },
        { name: "hardware", _id: "2" },
        { name: "test", _id: "3" },
      ],
    }).as("getSkills");
    cy.get("#editSkills").click();
    cy.wait("@getSkills");
    cy.get("#skillInput").type("test");
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response: {
        skills: [
          {
            _id: "1",
            name: "skill1",
          },
          {
            _id: "2",
            name: "skill2",
          },
          {
            _id: "3",
            name: "skill3",
          },
          {
            _id: "4",
            name: "test",
          },
        ],
      },
    }).as("profileCall");
    cy.route({
      method: "post",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/skill",
      status: 200,
      response: "Success",
    }).as("addSkillCall");
    cy.contains("test")
      .should("be.visible")
      .and("have.class", "MuiAutocomplete-option")
      .click();
    cy.wait("@addSkillCall");
    cy.wait("@profileCall");
    cy.get("#skillList").contains("skill1");
    cy.get("#skillList").contains("skill2");
    cy.get("#skillList").contains("skill3");
    cy.get("#skillList").contains("test");
  });

  it("Add skill failure", () => {
    cy.fakeProfile();
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/skills",
      status: 200,
      response: [
        { name: "dev", _id: "1" },
        { name: "hardware", _id: "2" },
        { name: "test", _id: "3" },
      ],
    }).as("getSkills");
    cy.get("#editSkills").click();
    cy.get("#skillInput").type("test");
    cy.route({
      method: "post",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/skill",
      status: 401,
      response: "An error has occoured while trying to add a skill.",
    }).as("addSkillCall");
    cy.contains("test")
      .should("be.visible")
      .and("have.class", "MuiAutocomplete-option")
      .click();
    cy.wait("@addSkillCall");
    cy.contains("An error has occoured while trying to add a skill.");
  });

  it("Delete skill success", () => {
    cy.fakeProfile();
    cy.get("#editSkills").click();
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response: {
        skills: [
          {
            _id: "2",
            name: "skill2",
          },
          {
            _id: "3",
            name: "skill3",
          },
          {
            _id: "4",
            name: "test",
          },
        ],
      },
    }).as("profileCall");
    cy.route({
      method: "delete",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/skill",
      status: 200,
      response: "Success",
    }).as("deleteSkillCall");
    cy.get("#skillList [name='skill1'] svg").click();
    cy.wait("@deleteSkillCall");
    cy.wait("@profileCall");
    cy.get("#skillList").should("not.contain", "skill1");
    cy.get("#skillList").contains("skill2");
    cy.get("#skillList").contains("skill3");
    cy.get("#skillList").contains("test");
  });

  it("Delete skill failure", () => {
    cy.fakeProfile();
    cy.get("#editSkills").click();
    cy.route({
      method: "delete",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/skill",
      status: 401,
      response: "An error has occoured while trying to delete a skill.",
    }).as("deleteSkillCall");
    cy.get("#skillList [name='skill1'] svg").click();
    cy.wait("@deleteSkillCall");
    cy.wait("@profileCall");
    cy.get("#skillList").contains("skill1");
    cy.contains("An error has occoured while trying to delete a skill.");
  });

  it("Cancel basic profile edit", () => {
    cy.fakeProfile();
    cy.get("#editSkills").click();
    cy.get("#skillInput").type("test");
    cy.get("#editSkills").click();
    cy.get("#editSkills").click();
    cy.get("#skillInput").should("not.have.value", "test");
  });
});
