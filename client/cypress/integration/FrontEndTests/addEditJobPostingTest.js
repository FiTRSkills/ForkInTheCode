describe("Add Edit Job Posting", () => {
  beforeEach(() => {
    cy.fakeLogin("EmployerProfile");
  });

  it("Add Job Posting SUCCESS", () => {
    cy.InitializeSkills(true, "/JobPosting/Add");
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPosting",
      status: 200,
      response: "Successfully created job posting",
    }).as("addJobPosting");

    cy.get("#navBarTitle").should("contain", "Job Postings");

    cy.get("#jobTitle").type("Java Developer");
    cy.get("#description").type("This is a Java job");
    cy.get("#zipCode").type("12345");

    cy.get("#salary").type("2000");
    cy.get("#responsibilities").type("Java development");

    cy.get("#benefits").type("More Java experience");

    cy.get("#amountOfJobs").type("3");
    cy.get("#jobTimeline").type("3 Months");

    cy.get("#method").select("In Person");
    cy.get("#location").type("45 Hazel Street, Rochester, NY");

    cy.get("#skillInput").type("developer");
    cy.contains("developer").click();
    cy.get("#skillList").should("contain", "developer");

    cy.get("#submit").click();

    cy.wait("@addJobPosting").its("status").should("eq", 200);
  });

  it("Add Job Posting FAILURE", () => {
    cy.InitializeSkills(true, "/JobPosting/Add");
    cy.route({
      method: "POST",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPosting",
      status: 400,
      response: {
        errors: [
          { msg: "Must be a viable location" },
          { msg: "Must contain valid skills" },
        ],
      },
    }).as("addJobPosting");

    cy.get("#navBarTitle").should("contain", "Job Postings");

    cy.get("#jobTitle").type("Java Developer");
    cy.get("#description").type("This is a Java job");
    cy.get("#zipCode").type("12345");

    cy.get("#salary").type("2000");
    cy.get("#responsibilities").type("Java development");

    cy.get("#benefits").type("More Java experience");

    cy.get("#amountOfJobs").type("3");
    cy.get("#jobTimeline").type("3 Months");

    cy.get("#skillInput").type("developer");
    cy.contains("developer").click();
    cy.get("#skillList").should("contain", "developer");

    cy.get("#submit").click();

    cy.wait("@addJobPosting").its("status").should("eq", 400);
  });

  it("Edit job posting SUCCESS", () => {
    cy.route({
      method: "PATCH",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPosting",
      status: 200,
      response: "Successfully updated job posting",
    }).as("editJobPosting");

    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPosting?_id=1",
      status: 200,
      response: {
        _id: "1",
        jobTitle: "Java",
        description: "This is a Java job",
        zipCode: "12345",
        salary: "2000",
        responsibilities: "Many Java work",
        benefits: "Many Java benefits",
        amountOfJobs: "3",
        jobTimeline: "3 Months",
        location: "location",
        skills: [
          {
            description: "desc",
            name: "saad",
            _id: "1",
          },
        ],
      },
    }).as("getJobPosting");

    cy.InitializeSkills(true, "/JobPosting/Edit/1");

    cy.wait("@getJobPosting").its("status").should("eq", 200);

    cy.get("#navBarTitle").should("contain", "Job Postings");

    cy.get("#jobTitle").should("have.value", "Java");
    cy.get("#description").should("have.value", "This is a Java job");
    cy.get("#zipCode").should("have.value", "12345");
    cy.get("#salary").should("have.value", "2000");

    cy.get("#responsibilities").should("have.value", "Many Java work");
    cy.get("#benefits").should("have.value", "Many Java benefits");

    cy.get("#amountOfJobs").type("3");
    cy.get("#jobTimeline").should("have.value", "3 Months");

    cy.get("#method").should("have.value", "In Person");
    cy.get("#location").should("have.value", "location");

    cy.get("#skillList").should("contain", "saad");

    cy.get("#submit").click();

    cy.wait("@editJobPosting").its("status").should("eq", 200);
  });

  it("Edit job posting FAILURE", () => {
    cy.route({
      method: "PATCH",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPosting",
      status: 400,
      response: {
        errors: [
          { msg: "Must be a viable location" },
          { msg: "Must contain valid skills" },
        ],
      },
    }).as("editJobPosting");

    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPosting?_id=1",
      status: 200,
      response: {
        _id: "1",
        jobTitle: "Java",
        description: "This is a Java job",
        zipCode: "12345",
        salary: "2000",
        responsibilities: "Many Java work",
        benefits: "Many Java benefits",
        amountOfJobs: "3",
        jobTimeline: "3 Months",
        location: "location",
        skills: [
          {
            description: "desc",
            name: "saad",
            _id: "1",
          },
        ],
      },
    }).as("getJobPosting");

    cy.InitializeSkills(true, "/JobPosting/Edit/1");

    cy.wait("@getJobPosting").its("status").should("eq", 200);

    cy.get("#navBarTitle").should("contain", "Job Postings");

    cy.get("#jobTitle").should("have.value", "Java");
    cy.get("#description").should("have.value", "This is a Java job");
    cy.get("#zipCode").should("have.value", "12345");
    cy.get("#salary").should("have.value", "2000");

    cy.get("#responsibilities").should("have.value", "Many Java work");
    cy.get("#benefits").should("have.value", "Many Java benefits");

    cy.get("#amountOfJobs").type("3");
    cy.get("#jobTimeline").should("have.value", "3 Months");

    cy.get("#method").should("have.value", "In Person");
    cy.get("#location").type("something so front end will allow submission");

    cy.get("#skillList").should("contain", "saad");

    cy.get("#submit").click();

    cy.wait("@editJobPosting").its("status").should("eq", 400);
    cy.contains("Must be a viable location. Must contain valid skills");
  });
});
