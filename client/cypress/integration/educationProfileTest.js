describe("Load profile educations", () => {
  it("Load educations profile success", () => {
    cy.fakeProfile();
    cy.wait("@profileCall").its("status").should("eq", 200);
    cy.get("#education0 [name='degree']").should("have.value", "BS SE");
  });

  it("Load educations profile failure", () => {
    cy.fakeLogin();
    // Stub get profile error response
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 400,
      response: "Access denied",
    }).as("profileCall");
    // Go to profile. Verify profile loaded failed.
    cy.get("#Profile").click();
    cy.get("#navBarTitle").should("contain", "Profile");
    cy.wait("@profileCall").its("status").should("eq", 400);
    cy.contains("Access denied");
  });

  it("Edit education profile success", () => {
    cy.fakeProfile();
    cy.route({
      method: "patch",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/education",
      status: 200,
      response: "Success",
    }).as("setProfileCall");
    // Go to profile. Verify profile loaded success.
    cy.get("#Profile").click();
    cy.wait("@profileCall");
    cy.get("#editEducations").click();
    cy.wait(150);
    cy.get("#education0 [name='editEducation']").click();
    cy.get("#education0 [name='degree']").type("{selectall}{backspace}BS CS");
    cy.get("#education0 [name='major']").type("{selectall}{backspace}CS");
    cy.get("#education0 [name='organization']").type(
      "{selectall}{backspace}microsoft"
    );
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response: {
        education: [
          {
            degree: "BS CS",
            major: "CS",
            endDate: "2020-01-01",
            organization: {
              _id: "id",
              name: "microsoft",
            },
          },
        ],
      },
    }).as("profileCall");
    cy.get("#education0 [name='updateEducation']").click();
    cy.wait("@setProfileCall");
    cy.wait("@profileCall");
    cy.get("#education0 [name='degree']").should("have.value", "BS CS");
    cy.get("#education0 [name='degree']").should("be.disabled");
    cy.get("#education0 [name='major']").should("have.value", "CS");
    cy.get("#education0 [name='major']").should("be.disabled");
    cy.get("#education0 [name='organization']").should(
      "have.value",
      "microsoft"
    );
    cy.get("#education0 [name='organization']").should("be.disabled");
  });

  it("Edit education profile failure", () => {
    // Stub get profile success response
    cy.fakeProfile();
    cy.route({
      method: "patch",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/education",
      status: 401,
      response: "An error has occoured while trying to edit a education.",
    }).as("setProfileCall");
    // Go to profile. Verify profile loaded success.
    cy.get("#Profile").click();
    cy.wait("@profileCall");
    cy.get("#editEducations").click();
    cy.wait(150);
    cy.get("#education0 [name='editEducation']").click();
    cy.get("#education0 [name='degree']").type(
      "{selectall}{backspace}designer"
    );
    cy.get("#education0 [name='organization']").type(
      "{selectall}{backspace}microsoft"
    );
    cy.get("#education0 [name='updateEducation']").click();
    cy.wait("@setProfileCall");
    cy.contains("An error has occoured while trying to edit a education.");
  });

  it("Add education profile success", () => {
    cy.fakeProfile();
    cy.route({
      method: "post",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/education",
      status: 200,
      response: "Success",
    }).as("addProfileCall");
    cy.wait("@profileCall");
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response: {
        education: [
          {
            degree: "BS SE",
            major: "SE",
            organization: {
              _id: "id",
              name: "RIT",
            },
          },
          {
            degree: "BS CS",
            major: "CS",
            organization: {
              _id: "id",
              name: "PITT",
            },
          },
        ],
      },
    }).as("profileCall");
    cy.get("#addEducation").click();
    cy.get("#addEducationDegree").type("BS CS");
    cy.get("#addEducationMajor").type("CS");
    cy.get("#addEducationOrganization").type("PITT");
    cy.get("#addEducationSubmit").click();
    cy.wait("@addProfileCall");
    cy.wait("@profileCall");
    cy.get("#education1 [name='degree']").should("have.value", "BS CS");
    cy.get("#education1 [name='degree']").should("be.disabled");
    cy.get("#education1 [name='major']").should("have.value", "CS");
    cy.get("#education1 [name='major']").should("be.disabled");
    cy.get("#education1 [name='organization']").should("have.value", "PITT");
    cy.get("#education1 [name='organization']").should("be.disabled");
  });

  it("Add education profile failure", () => {
    cy.fakeProfile();
    cy.route({
      method: "post",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/education",
      status: 401,
      response: "Failed to create a new education.",
    }).as("addProfileCall");
    cy.wait("@profileCall");
    cy.get("#addEducation").click();
    cy.get("#addEducationDegree").type("newDev");
    cy.get("#addEducationMajor").type("newDev");
    cy.get("#addEducationOrganization").type("newOrg");
    cy.get("#addEducationSubmit").click();
    cy.wait("@addProfileCall");
    cy.contains("Failed to create a new education.");
  });

  it("Delete education profile success", () => {
    cy.fakeProfile();
    cy.route({
      method: "delete",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/education",
      status: 200,
      response: "Success",
    }).as("deleteProfileCall");
    cy.wait("@profileCall");
    cy.get("#editEducations").click();
    cy.wait(150);
    cy.get("#education0 [name='editEducation']").click();
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response: {
        education: [],
      },
    }).as("profileCall");
    cy.get("#education0 [name='deleteEducation']").click();
    cy.wait("@deleteProfileCall");
    cy.wait("@profileCall");
    cy.get("#education0").should("not.exist");
  });

  it("Delete education profile failure", () => {
    cy.fakeProfile();
    cy.route({
      method: "delete",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/education",
      status: 401,
      response: "Failure",
    }).as("deleteProfileCall");
    cy.wait("@profileCall");
    cy.get("#editEducations").click();
    cy.wait(150);
    cy.get("#education0 [name='editEducation']").click();
    cy.get("#education0 [name='deleteEducation']").click();
    cy.wait("@deleteProfileCall");
    cy.get("#education0").should("exist");
    cy.contains("An error has occoured while trying to delete a education.");
  });

  it("Closing add education clears data", () => {
    cy.fakeProfile();
    cy.wait("@profileCall");
    cy.get("#addEducation").click();
    cy.get("#addEducationDegree").type("newDev");
    cy.get("#addEducationMajor").type("newDev");
    cy.get("#addEducationOrganization").type("newOrg");
    cy.get("#closeAddEducation").click();
    cy.get("#addEducation").click();
    cy.get("#addEducationDegree").should("have.value", "");
    cy.get("#addEducationMajor").should("have.value", "");
    cy.get("#addEducationOrganization").should("have.value", "");
  });

  it("Cancel edit resets content", () => {
    cy.fakeProfile();
    // Go to profile. Verify profile loaded success.
    cy.get("#Profile").click();
    cy.wait("@profileCall");
    cy.get("#editEducations").click();
    cy.wait(150);
    cy.get("#education0 [name='editEducation']").click();
    cy.get("#education0 [name='degree']").type(
      "{selectall}{backspace}designer"
    );
    cy.get("#education0 [name='major']").type("{selectall}{backspace}designer");
    cy.get("#education0 [name='organization']").type(
      "{selectall}{backspace}microsoft"
    );
    cy.get("#education0 [name='editEducation']").click();
    cy.wait("@profileCall");
    cy.get("#education0 [name='degree']").should("have.value", "BS SE");
    cy.get("#education0 [name='degree']").should("be.disabled");
    cy.get("#education0 [name='major']").should("have.value", "SE");
    cy.get("#education0 [name='major']").should("be.disabled");
    cy.get("#education0 [name='organization']").should("have.value", "RIT");
    cy.get("#education0 [name='organization']").should("be.disabled");
  });

  it("Cancel overall edit cancels individual edit", () => {
    cy.fakeProfile();
    // Go to profile. Verify profile loaded success.
    cy.get("#Profile").click();
    cy.wait("@profileCall");
    cy.get("#editEducations").click();
    cy.wait(150);
    cy.get("#education0 [name='editEducation']").click();
    cy.get("#editEducations").click();
    cy.wait(150);
    cy.get("#editEducations").click();
    cy.wait(150);
    cy.get("#education0 [name='degree']").should("be.disabled");
  });
});
