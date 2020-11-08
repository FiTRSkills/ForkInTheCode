describe("Load profile", () => {
  beforeEach(() => {
    // Login first
    cy.fakeLogin();
  });

  it("Load profile success", () => {
    // Stub get profile success response
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/Profile",
      status: 200,
      response: {
        firstname: "John",
        lastname: "Appleseed",
        dob: "1998-01-05",
        education: [
          {
            degree: "BS Software Engineering",
            major: "Software Engineering",
            organization: "RIT",
          },
        ],
        career: [
          {
            jobTitle: "Student",
            startDate: "2018-01-01",
            endDate: "2020-01-01",
            organization: "Apple",
          },
        ],
      },
    }).as("profileCall");
    // Go to profile. Verify profile loaded success.
    cy.get("#Profile").click();
    cy.get("#navBarTitle").should("contain", "Profile");
    cy.wait("@profileCall").its("status").should("eq", 200);
    cy.get("p[name='firstName']").should("contain", "John");
  });

  it("Load profile failure", () => {
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
});
