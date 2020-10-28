describe("Profile", () => {
  beforeEach(() => {
    // Login first
    cy.visit("/Login");
    cy.get("#navBarTitle").should("contain", "Login");
    cy.server();
    cy.route({
      method: "POST",
      url: "http://localhost:9000/Login",
      status: 200,
      response: {
        user: { id: 1 },
      },
    }).as("loginCall");
    cy.get("#email").type("email@email.com");
    cy.get("#password").type("123456");
    cy.get("#submit").click();
    cy.wait("@loginCall").its("status").should("eq", 200);
    cy.get("#navBarTitle").should("contain", "Home");
  });

  it("Load profile success", () => {
    // Stub get profile success response
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
    cy.get("#navBarTitle").should("contain", "Profile");
    cy.wait("@profileCall").its("status").should("eq", 200);
    cy.get("p[name='firstName']").should("contain", "John");
  });

  it("Load profile failure", () => {
    // Stub get profile error response
    cy.route({
      method: "GET",
      url: "http://localhost:9000/Profile",
      status: 400,
      response: "Access denied",
    }).as("profileCall");
    // Go to profile. Verify profile loaded failed.
    cy.get("#Profile").click();
    cy.get("#navBarTitle").should("contain", "Profile");
    cy.wait("@profileCall").its("status").should("eq", 400);
    cy.contains("Access denied");
  });

  it("Edit profile success", () => {
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
    // Stub get profile success response
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
