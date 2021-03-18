describe("Add Edit Course", () => {
  it("Add ONLINE course SUCCESS", () => {
    cy.fakeLogin('EducatorProfile');
    cy.SkillsDropdown(true, '/Course/Add');
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/courses/course",
      status: 200,
      response: "Successfully created course",
    }).as("addCourse");
    cy.visit(Cypress.env("REACT_APP_CLIENT_URL") + "/Course/Add");

    // cy.get("#navBarTitle").should("contain", "Courses");

    cy.get("#title").type("Java 101");
    cy.get("#description").type("This is a Java class");
    cy.get("#moneyCost").type("2000");
    cy.get("#timeCost").type("03/14/2021 - 04/14/2021");

    cy.get("#period").select("3 Months");
    cy.get("#times").type("Monday: 15:00 - 18:00");

    cy.get("#method").select("Online");
    cy.get("#location").should("not.be.visible");

    cy.get("#requiredEquipment").type("Computer");
    cy.get("#contact").type("Jake Rossi: 567-019-2345");

    cy.get("#skillInput").type("developer");
    cy.contains("developer").click();
    cy.get("#addSkill").click();
    cy.get("#skillList").should("contain", "developer");

    cy.get("#submit").click();

    cy.wait("@addCourse").its("status").should("eq", 200);
    cy.contains("Successfully created course");
  });

  it("Add IN PERSON course SUCCESS", () => {
    cy.fakeLogin('EducatorProfile');
    cy.SkillsDropdown(true, '/Course/Add');
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/courses/course",
      status: 200,
      response: "Successfully created course",
    }).as("addCourse");

    cy.get("#navBarTitle").should("contain", "Courses");

    cy.get("#title").type("Java 101");
    cy.get("#description").type("This is a Java class");
    cy.get("#moneyCost").type("2000");
    cy.get("#timeCost").type("03/14/2021 - 04/14/2021");

    cy.get("#period").select("3 Months");
    cy.get("#times").type("Monday: 15:00 - 18:00");

    cy.get("#method").select("In Person");
    cy.get("#location").type("45 Hazel Street, Rochester, NY");

    cy.get("#requiredEquipment").type("Computer");
    cy.get("#contact").type("Jake Rossi: 567-019-2345");

    cy.get("#skillInput").type("developer");
    cy.contains("developer").click();
    cy.get("#addSkill").click();
    cy.get("#skillList").should("contain", "developer");

    cy.get("#submit").click();

    cy.wait("@addCourse").its("status").should("eq", 200);
    cy.contains("Successfully created course");
  });

  it("Add ONLINE course FAILURE", () => {
    cy.fakeLogin('EducatorProfile');
    cy.SkillsDropdown(true, '/Course/Add');
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/courses/course",
      status: 400,
      response: {
        errors: [
          { msg: "Must be a viable location" },
          { msg: "Must contain valid skills" },
        ],
      },
    }).as("addCourse");

    cy.get("#navBarTitle").should("contain", "Courses");

    cy.get("#title").type("Java 101");
    cy.get("#description").type("This is a Java class");
    cy.get("#moneyCost").type("2000");
    cy.get("#timeCost").type("03/14/2021 - 04/14/2021");

    cy.get("#period").select("3 Months");
    cy.get("#times").type("Monday: 15:00 - 18:00");

    cy.get("#method").select("Online");
    cy.get("#location").should("not.be.visible");

    cy.get("#requiredEquipment").type("Computer");
    cy.get("#contact").type("Jake Rossi: 567-019-2345");

    cy.get("#skillInput").type("developer");
    cy.contains("developer").click();
    cy.get("#addSkill").click();
    cy.get("#skillList").should("contain", "developer");

    cy.get("#submit").click();

    cy.wait("@addCourse").its("status").should("eq", 400);
    cy.contains("Must be a viable location. Must contain valid skills");
  });

  it("Add IN PERSON course FAILURE", () => {
    cy.fakeLogin('EducatorProfile');
    cy.SkillsDropdown(true, '/Course/Add');
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/courses/course",
      status: 400,
      response: "Error on course creation",
    }).as("addCourse");

    cy.get("#navBarTitle").should("contain", "Courses");

    cy.get("#title").type("Java 101");
    cy.get("#description").type("This is a Java class");
    cy.get("#moneyCost").type("2000");
    cy.get("#timeCost").type("03/14/2021 - 04/14/2021");

    cy.get("#period").select("3 Months");
    cy.get("#times").type("Monday: 15:00 - 18:00");

    cy.get("#method").select("In Person");
    cy.get("#location").type("45 Hazel Street, Rochester, NY");

    cy.get("#requiredEquipment").type("Computer");
    cy.get("#contact").type("Jake Rossi: 567-019-2345");

    cy.get("#skillInput").type("developer");
    cy.contains("developer").click();
    cy.get("#addSkill").click();
    cy.get("#skillList").should("contain", "developer");

    cy.get("#submit").click();

    cy.wait("@addCourse").its("status").should("eq", 400);
    cy.contains("Error on course creation");
  });

  it("Edit course SUCCESS", () => {
    cy.fakeLogin('EducatorProfile');
    cy.SkillsDropdown(true, '/Course/Edit');
    cy.route({
      method: "PATCH",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/courses/course",
      status: 200,
      response: "Successfully updated course",
    }).as("editCourse");

    cy.get("#navBarTitle").should("contain", "Courses");

    cy.get("#title").should("have.value", "Java 101");
    cy.get("#description").should("have.value", "Java class");
    cy.get("#moneyCost").should("have.value", "10000");
    cy.get("#timeCost").should("have.value", "03/02/2021 - 05/02/2022");

    cy.get("#period").should("have.value", "3 Months");
    cy.get("#times").should("have.value", "Monday: 15:00 - 18:00");

    cy.get("#method").should("have.value", "In Person");
    cy.get("#location").should("have.value", "Harvard");

    cy.get("#requiredEquipment").should("have.value", "Computer");
    cy.get("#contact").should("have.value", "Jake Rossi: 567-019-2345");

    cy.get("#skillList").should("contain", "saad");

    cy.get("#submit").click();

    cy.wait("@editCourse").its("status").should("eq", 200);
    cy.contains("Successfully updated course");
  });

  it("Edit course FAILURE", () => {
    cy.fakeLogin('EducatorProfile');
    cy.SkillsDropdown(true, '/Course/Edit');
    cy.route({
      method: "PATCH",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/courses/course",
      status: 400,
      response: {
        errors: [
          { msg: "Must be a viable location" },
          { msg: "Must contain valid skills" },
        ],
      },
    }).as("editCourse");
    
    cy.get("#navBarTitle").should("contain", "Courses");

    cy.get("#title").should("have.value", "Java 101");
    cy.get("#description").should("have.value", "Java class");
    cy.get("#moneyCost").should("have.value", "10000");
    cy.get("#timeCost").should("have.value", "03/02/2021 - 05/02/2022");

    cy.get("#period").should("have.value", "3 Months");
    cy.get("#times").should("have.value", "Monday: 15:00 - 18:00");

    cy.get("#method").should("have.value", "In Person");
    cy.get("#location").should("have.value", "Harvard");

    cy.get("#requiredEquipment").should("have.value", "Computer");
    cy.get("#contact").should("have.value", "Jake Rossi: 567-019-2345");

    cy.get("#skillList").should("contain", "saad");

    cy.get("#submit").click();

    cy.wait("@editCourse").its("status").should("eq", 400);
    cy.contains("Must be a viable location. Must contain valid skills");
  });
});
