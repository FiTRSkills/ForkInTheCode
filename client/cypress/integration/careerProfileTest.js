describe("Load profile careers", () => {
  it("Load careers profile success", () => {
    cy.fakeProfile();
    cy.wait("@profileCall").its("status").should("eq", 200);
    cy.get("#career0 [name='jobTitle']").should("have.value", "Dev");
  });

  it("Load careers profile failure", () => {
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

  it("Edit career profile success", () => {
    cy.fakeProfile();
    cy.route({
      method: "patch",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/career",
      status: 200,
      response: "Success",
    }).as("setProfileCall");
    // Go to profile. Verify profile loaded success.
    cy.get("#Profile").click();
    cy.wait("@profileCall");
    cy.get("#editCareers").click();
    cy.wait(150);
    cy.get("#career0 [name='editCareer']").click();
    cy.get("#career0 [name='jobTitle']").type("{selectall}{backspace}designer");
    cy.get("#career0 [name='organization']").type(
      "{selectall}{backspace}microsoft"
    );
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response: {
        career: [
          {
            jobTitle: "designer",
            startDate: "2018-01-01",
            endDate: "2020-01-01",
            organization: {
              _id: "id",
              name: "microsoft",
            },
          },
        ],
      },
    }).as("profileCall");
    cy.get("#career0 [name='updateCareer']").click();
    cy.wait("@setProfileCall");
    cy.wait("@profileCall");
    cy.get("#career0 [name='jobTitle']").should("have.value", "designer");
    cy.get("#career0 [name='jobTitle']").should("be.disabled");
    cy.get("#career0 [name='organization']").should("have.value", "microsoft");
    cy.get("#career0 [name='organization']").should("be.disabled");
  });

  it("Edit career profile failure", () => {
    // Stub get profile success response
    cy.fakeProfile();
    cy.route({
      method: "patch",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/career",
      status: 401,
      response: "An error has occoured while trying to edit a career.",
    }).as("setProfileCall");
    // Go to profile. Verify profile loaded success.
    cy.get("#Profile").click();
    cy.wait("@profileCall");
    cy.get("#editCareers").click();
    cy.wait(150);
    cy.get("#career0 [name='editCareer']").click();
    cy.get("#career0 [name='jobTitle']").type("{selectall}{backspace}designer");
    cy.get("#career0 [name='organization']").type(
      "{selectall}{backspace}microsoft"
    );
    cy.get("#career0 [name='updateCareer']").click();
    cy.wait("@setProfileCall");
    cy.contains("An error has occoured while trying to edit a career.");
  });

  it("Add career profile success", () => {
    cy.fakeProfile();
    cy.wait("@profileCall");
    cy.route({
      method: "post",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/career",
      status: 200,
      response: "Success",
    }).as("addProfileCall");
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response: {
        career: [
          {
            jobTitle: "Dev",
            startDate: "2018-01-01",
            endDate: "2020-01-01",
            organization: {
              _id: "id",
              name: "Apple",
            },
          },
          {
            jobTitle: "newDev",
            startDate: "2018-01-01",
            endDate: "2020-01-01",
            organization: {
              _id: "id",
              name: "newOrg",
            },
          },
        ],
      },
    }).as("profileCall");
    cy.get("#addCareer").click();
    cy.get("#addCareerJobTitle").type("newDev");
    cy.get("#addCareerStartDate").type("20180101");
    cy.get("#addCareerEndDate").type("20200101");
    cy.get("#addCareerOrganization").type("newOrg");
    cy.get("#addCareerSubmit").click();
    cy.wait("@addProfileCall");
    cy.wait("@profileCall");
    cy.get("#career1 [name='jobTitle']").should("have.value", "newDev");
    cy.get("#career1 [name='jobTitle']").should("be.disabled");
    cy.get("#career1 [name='organization']").should("have.value", "newOrg");
    cy.get("#career1 [name='organization']").should("be.disabled");
  });

  it("Add career profile failure", () => {
    cy.fakeProfile();
    cy.route({
      method: "post",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/career",
      status: 401,
      response: "Failed to create a new career.",
    }).as("addProfileCall");
    cy.wait("@profileCall");
    cy.get("#addCareer").click();
    cy.get("#addCareerJobTitle").type("newDev");
    cy.get("#addCareerStartDate").type("20180101");
    cy.get("#addCareerEndDate").type("20200101");
    cy.get("#addCareerOrganization").type("newOrg");
    cy.get("#addCareerSubmit").click();
    cy.wait("@addProfileCall");
    cy.contains("Failed to create a new career.");
  });

  it("Delete career profile success", () => {
    cy.fakeProfile();
    cy.route({
      method: "delete",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/career",
      status: 200,
      response: "Success",
    }).as("deleteProfileCall");
    cy.wait("@profileCall");
    cy.get("#editCareers").click();
    cy.get("#career0 [name='editCareer']").click();
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response: {
        career: [],
      },
    }).as("profileCall");
    cy.get("#career0 [name='deleteCareer']").click();
    cy.contains("Are you sure you would like to delete this Career?");
    cy.get("#confirmationConfirm").click();
    cy.wait("@deleteProfileCall");
    cy.wait("@profileCall");
    cy.get("#career0").should("not.exist");
  });

  it("Delete career profile failure", () => {
    cy.fakeProfile();
    cy.route({
      method: "delete",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/profile/career",
      status: 401,
      response: "Failure",
    }).as("deleteProfileCall");
    cy.wait("@profileCall");
    cy.get("#editCareers").click();
    cy.wait(150);
    cy.get("#career0 [name='editCareer']").click();
    cy.get("#career0 [name='deleteCareer']").click();
    cy.contains("Are you sure you would like to delete this Career?");
    cy.get("#confirmationConfirm").click();
    cy.wait("@deleteProfileCall");
    cy.get("#career0").should("exist");
    cy.contains("An error has occoured while trying to delete a career.");
  });

  it("Delete career profile cancel", () => {
    cy.fakeProfile();
    cy.wait("@profileCall");
    cy.get("#editCareers").click();
    cy.get("#career0 [name='editCareer']").click();
    cy.get("#career0 [name='deleteCareer']").click();
    cy.contains("Are you sure you would like to delete this Career?");
    cy.get("#confirmationCancel").click();
    cy.get("#career0").should("exist");
  });

  it("Closing add career clears data", () => {
    cy.fakeProfile();
    cy.wait("@profileCall");
    cy.get("#addCareer").click();
    cy.get("#addCareerJobTitle").type("newDev");
    cy.get("#addCareerOrganization").type("newOrg");
    cy.get("#closeAddCareer").click();
    cy.get("#addCareer").click();
    cy.get("#addCareerJobTitle").should("have.value", "");
    cy.get("#addCareerOrganization").should("have.value", "");
  });

  it("Cancel edit resets content", () => {
    cy.fakeProfile();
    // Go to profile. Verify profile loaded success.
    cy.get("#Profile").click();
    cy.wait("@profileCall");
    cy.get("#editCareers").click();
    cy.wait(150);
    cy.get("#career0 [name='editCareer']").click();
    cy.get("#career0 [name='jobTitle']").type("{selectall}{backspace}designer");
    cy.get("#career0 [name='organization']").type(
      "{selectall}{backspace}microsoft"
    );
    cy.get("#career0 [name='editCareer']").click();
    cy.wait("@profileCall");
    cy.get("#career0 [name='jobTitle']").should("have.value", "Dev");
    cy.get("#career0 [name='jobTitle']").should("be.disabled");
    cy.get("#career0 [name='organization']").should("have.value", "Apple");
    cy.get("#career0 [name='organization']").should("be.disabled");
  });

  it("Cancel overall edit cancels individual edit", () => {
    cy.fakeProfile();
    // Go to profile. Verify profile loaded success.
    cy.get("#Profile").click();
    cy.wait("@profileCall");
    cy.get("#editCareers").click();
    cy.wait(150);
    cy.get("#career0 [name='editCareer']").click();
    cy.get("#editCareers").click();
    cy.wait(150);
    cy.get("#editCareers").click();
    cy.wait(150);
    cy.get("#career0 [name='jobTitle']").should("be.disabled");
  });
});
