describe("Edit profile", () => {
  beforeEach(() => {
    // Login first
    cy.fakeLogin();
    cy.fakeProfile();
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
