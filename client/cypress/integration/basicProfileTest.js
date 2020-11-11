describe("Load basic profile", () => {
  beforeEach(() => {
    // Login first
    cy.fakeLogin();
  });

  it("Load basic profile success", () => {
    // Stub get profile success response
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response: {
        firstname: "John",
        lastname: "Appleseed",
        dob: "1998-01-05",
        education: [],
        career: [],
      },
    }).as("profileCall");
    // Go to profile. Verify profile loaded success.
    cy.get("#Profile").click();
    cy.get("#navBarTitle").should("contain", "Profile");
    cy.wait("@profileCall").its("status").should("eq", 200);
    cy.get("#firstName").should("have.value", "John");
  });

  it("Load basic profile failure", () => {
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

  it("Edit basic profile success", () => {
    let response1 = {
      firstname: "John",
      lastname: "Apple",
      dob: "1988-10-10",
      education: [],
      career: [],
    };
    let response2 = {
      firstname: "Sam",
      lastname: "Riegal",
      dob: "1988-10-10",
      education: [],
      career: [],
    };
    // Stub get profile success response
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response: response1,
    }).as("getProfileCall");
    cy.route({
      method: "post",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response: "Success",
    }).as("setProfileCall");
    // Go to profile. Verify profile loaded success.
    cy.get("#Profile").click();
    cy.wait("@getProfileCall");
    cy.get("#basicProfileEdit").click();
    cy.get("#firstName").type(
      "{backspace}{backspace}{backspace}{backspace}Sam"
    );
    cy.get("#lastName").type(
      "{backspace}{backspace}{backspace}{backspace}{backspace}Riegal"
    );
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response: response2,
    }).as("getProfileCall");
    cy.get("#submit").click();
    cy.wait("@setProfileCall");
    cy.wait("@getProfileCall");
    cy.get("#firstName").should("have.value", "Sam");
    cy.get("#firstName").should("be.disabled");
    cy.get("#lastName").should("have.value", "Riegal");
    cy.get("#lastName").should("be.disabled");
  });

  it("Edit basic profile failure", () => {
    // Stub get profile success response
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response: {
        firstname: "John",
        lastname: "Apple",
        dob: "1988-10-10",
        education: [],
        career: [],
      },
    }).as("getProfileCall");
    cy.route({
      method: "post",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 402,
      response: "Failed to save profile",
    }).as("setProfileCall");
    // Go to profile. Verify profile loaded success.
    cy.get("#Profile").click();
    cy.wait("@getProfileCall");
    cy.get("#basicProfileEdit").click();
    cy.get("#firstName").type(
      "{backspace}{backspace}{backspace}{backspace}Sam"
    );
    cy.get("#lastName").type(
      "{backspace}{backspace}{backspace}{backspace}{backspace}Riegal"
    );
    cy.get("#submit").click();
    cy.wait("@setProfileCall");
    cy.contains("Failed to save profile");
  });

  it("Cancel basic profile edit", () => {
    // Stub get profile success response
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response: {
        firstname: "John",
        lastname: "Apple",
        dob: "1988-10-10",
        education: [],
        career: [],
      },
    }).as("getProfileCall");
    // Go to profile. Verify profile loaded success.
    cy.get("#Profile").click();
    cy.wait("@getProfileCall");
    cy.get("#basicProfileEdit").click();
    cy.get("#firstName").type(
      "{backspace}{backspace}{backspace}{backspace}Sam"
    );
    cy.get("#lastName").type(
      "{backspace}{backspace}{backspace}{backspace}{backspace}Riegal"
    );
    cy.get("#basicProfileEdit").click();
    cy.wait("@getProfileCall");
    cy.get("#firstName").should("have.value", "John");
    cy.get("#firstName").should("be.disabled");
    cy.get("#lastName").should("have.value", "Apple");
    cy.get("#lastName").should("be.disabled");
  });
});
