describe("Edit profile", () => {
  beforeEach(() => {
    // Login first
    cy.fakeLogin();

    // Stub get profile error response
    cy.route({
      method: "GET",
      url: "http://localhost:9000/Profile",
      status: 200,
      response: {
        firstname: "John",
        lastname: "Appleseed",
        dob: "1998-01-05",
        education: [
          {
            degree: "BS Software Engineering",
            major: "Software Engineering",
            institution: "RIT",
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
    cy.wait("@profileCall").its("status").should("eq", 200);
    cy.get("p[name='firstName']").should("contain", "John");
  });

  it("Edit profile success", () => {
    // Stub edit profile success response
    cy.route({
      method: "POST",
      url: "http://localhost:9000/Profile",
      status: 200,
      response: "Profile Updated.",
    }).as("editProfileCall");

    // Edit profile. Verify edit success.
    cy.get("button[name='editProfile']").click();
    cy.get("#firstName").type("John");
    cy.get("#lastName").type("Appleseed");
    cy.get("#dob").type("1998-01-05");
    cy.get("#submit").click();
    cy.wait("@editProfileCall").its("status").should("eq", 200);
  });

  it("Edit profile failure", () => {
    // Stub edit profile error response
    cy.route({
      method: "POST",
      url: "http://localhost:9000/Profile",
      status: 400,
      response: "Failed to save profile",
    }).as("editProfileCall");

    // Edit profile. Verify edit error.
    cy.get("button[name='editProfile']").click();
    cy.get("#firstName").type("John");
    cy.get("#lastName").type("Appleseed");
    cy.get("#dob").type("1998-01-05");
    cy.get("#submit").click();
    cy.wait("@editProfileCall").its("status").should("eq", 400);
  });
});
