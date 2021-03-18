describe("View Courses", () => {
  const getCoursesSuccessResponse = [
    {
      _id: "1",
      location: "Harvard",
      name: "Java 101",
      skills: [
        {
          description: "desc",
          name: "skill1",
          _id: "1",
        },
      ],
      period: "3 Months",
      times: "Monday: 15:00 - 18:00",
      organization: { name: "org1" },
    },
    {
      _id: "2",
      location: "RIT",
      name: "Python 101",
      skills: [
        {
          description: "desc",
          name: "skill2",
          _id: "2",
        },
      ],
      period: "6 Months",
      times: "Tuesday: 10:00 - 12:00",
      organization: { name: "org2" },
    },
  ];

  beforeEach(() => {
    // Login first
    cy.fakeEducatorLogin();
  });

  it("View Courses SUCCESS", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/courses",
      status: 200,
      response: getCoursesSuccessResponse,
    }).as("getCoursesCall");
    cy.get("#MyCourses").click();
    cy.wait("@getCoursesCall").its("status").should("eq", 200);
    cy.contains("Java 101");
    cy.contains("Harvard");
    cy.contains("3 Months");
    cy.contains("Monday: 15:00 - 18:00");
    cy.contains("skill1");
    cy.contains("org1");
    cy.contains("Python 101");
    cy.contains("RIT");
    cy.contains("6 Months");
    cy.contains("Tuesday: 10:00 - 12:00");
    cy.contains("skill2");
    cy.contains("org2");
  });

  it("Load job posting failure", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/courses",
      status: 400,
      response: "Failed to load Courses",
    }).as("getCoursesCall");
    cy.get("#MyCourses").click();
    cy.wait("@getCoursesCall").its("status").should("eq", 400);
    cy.contains("Failed to load Courses");
  });

  it("Navigate to Add Course SUCCESS", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/courses",
      status: 200,
      response: getCoursesSuccessResponse,
    }).as("getCoursesCall");
    cy.get("#MyCourses").click();
    cy.wait("@getCoursesCall").its("status").should("eq", 200);
    cy.get("#addCourseButton").click();
    cy.contains("Add Course");
  });

  it("Navigate to Edit Course SUCCESS", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/courses",
      status: 200,
      response: getCoursesSuccessResponse,
    }).as("getCoursesCall");
    cy.get("#MyCourses").click();
    cy.wait("@getCoursesCall").its("status").should("eq", 200);
    cy.get("#EditCourse1").click();
    cy.contains("Edit Course");
    cy.get("#title").should("have.value", "Java 101");
    cy.get("#location").should("have.value", "Harvard");
    cy.get("#period").should("have.value", "3 Months");
    cy.get("#times").should("have.value", "Monday: 15:00 - 18:00");
    cy.contains("skill1");
  });

  it("Delete Course CONFIRM SUCCESS", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/courses",
      status: 200,
      response: getCoursesSuccessResponse,
    }).as("getCoursesCall");
    cy.route({
      method: "DELETE",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/courses/course",
      status: 200,
      response: "Successfully Deleted",
    }).as("deleteCourseCall");
    cy.get("#MyCourses").click();
    cy.wait("@getCoursesCall").its("status").should("eq", 200);
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/courses",
      status: 200,
      response: [getCoursesSuccessResponse[1]],
    }).as("getCoursesCall");
    cy.get("#DeleteCourse1").click();
    cy.get("#confirmationConfirm").click();
    cy.get("body").should("not.contain", "Java 101");
  });

  it("Delete Course CANCEL SUCCESS", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/courses",
      status: 200,
      response: getCoursesSuccessResponse,
    }).as("getCoursesCall");
    cy.route({
      method: "DELETE",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/courses/course",
      status: 200,
      response: "Successfully Deleted",
    }).as("deleteCourseCall");
    cy.get("#MyCourses").click();
    cy.wait("@getCoursesCall").its("status").should("eq", 200);
    cy.get("#DeleteCourse1").click();
    cy.get("#confirmationConfirm").click();
    cy.contains("Java 101");
  });

  it("Delete Course FAILURE", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/courses",
      status: 200,
      response: getCoursesSuccessResponse,
    }).as("getCoursesCall");
    cy.route({
      method: "DELETE",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/courses/course",
      status: 400,
      response: "An error has occoured while trying to delete a course.",
    }).as("deleteCourseCall");
    cy.get("#MyCourses").click();
    cy.wait("@getCoursesCall").its("status").should("eq", 200);
    cy.get("#DeleteCourse1").click();
    cy.get("#confirmationConfirm").click();
    cy.contains("An error has occoured while trying to delete a course.");
  });
});
