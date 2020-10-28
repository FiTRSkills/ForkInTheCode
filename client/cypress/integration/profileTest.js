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
    cy.get("#username").type("test123@gmail.com");
    cy.get("#password").type("123456");
    cy.get("#submit").click();
    cy.wait("@loginCall").its("status").should("eq", 200);
    cy.get("#navBarTitle").should("contain", "Home");
    cy.server();
    cy.route({
      method: "GET",
      url: "http://localhost:9000/Profile",
      status: 200,
      response: {
        data: {
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
      },
    }).as("profileCall");
    // Go to profile
    cy.get("#Profile").click();
    cy.get("#navBarTitle").should("contain", "Profile");
  });

  it("Load profile", () => {
    cy.wait("@profileCall").its("status").should("eq", 200);
    cy.get("firstName").should("contain", "John");
  });
});
