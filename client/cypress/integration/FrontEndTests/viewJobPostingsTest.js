describe("View Job Postings", () => {
  const getJobPostingsSuccessResponse = [
    {
      _id: "1",
      jobTitle: "title1",
      zipCode: "12345",
      salary: "$100,000",
      responsibilities: "responsibilities 1",
      description: "description 1",
      benefits: "benefits",
      skills: [
        {
          description: "desc1",
          name: "skill1",
          _id: "1",
        },
      ],
      organization: { name: "org1" },
      courses: [
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
      ],
      amountOfJobs: "amountOfJobs1",
      jobTimeline: "jobTimeline1",
    },
    {
      _id: "2",
      jobTitle: "title2",
      zipCode: "54321",
      salary: "$200,000",
      responsibilities: "responsibilities 2",
      description: "description 2",
      benefits: "benefits",
      skills: [
        {
          description: "desc2",
          name: "skill2",
          _id: "2",
        },
      ],
      courses: [
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
      ],
      organization: { name: "org2" },
      amountOfJobs: "amountOfJobs2",
      jobTimeline: "jobTimeline2",
    },
  ];

  beforeEach(() => {
    // Login first
    cy.fakeLogin("EmployerProfile");
  });

  it("View Job Postings SUCCESS", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPostings",
      status: 200,
      response: getJobPostingsSuccessResponse,
    }).as("getJobPostingsCall");
    cy.get("#MyJobPostings").click();
    cy.wait("@getJobPostingsCall").its("status").should("eq", 200);
    cy.contains("org1");
    cy.contains("$100,000");
    cy.contains("description 1");
    cy.contains("skill2");
    cy.contains("org2");
    cy.contains("$200,000");
    cy.contains("description 2");
    cy.contains("skill2");
  });

  it("Load job posting failure", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPostings",
      status: 400,
      response: "Failed to load Job Postings",
    }).as("getJobPostingsCall");
    cy.get("#MyJobPostings").click();
    cy.wait("@getJobPostingsCall").its("status").should("eq", 400);
    cy.contains("Failed to load Job Postings");
  });

  it("Navigate to Add Job Posting SUCCESS", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPostings",
      status: 200,
      response: getJobPostingsSuccessResponse,
    }).as("getJobPostingsCall");
    cy.get("#MyJobPostings").click();
    cy.wait("@getJobPostingsCall").its("status").should("eq", 200);
    cy.get("#addJobPostingButton").click();
    cy.contains("Add Job Posting");
  });

  it("Navigate to Edit Job Postings SUCCESS", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPostings",
      status: 200,
      response: getJobPostingsSuccessResponse,
    }).as("getJobPostingsCall");
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPosting?_id=1",
      status: 200,
      response: getJobPostingsSuccessResponse[0],
    }).as("getJobPostingsCall");
    cy.get("#MyJobPostings").click();
    cy.wait("@getJobPostingsCall").its("status").should("eq", 200);
    cy.get("#EditJobPosting1").click();
    cy.contains("Edit Job Posting");
    cy.get("#jobTitle").should("have.value", "title1");
    cy.get("#description").should("have.value", "description 1");
    cy.get("#zipCode").should("have.value", "12345");
    cy.contains("skill1");
  });

  it("Delete Job Postings CONFIRM SUCCESS", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPostings",
      status: 200,
      response: getJobPostingsSuccessResponse,
    }).as("getJobPostingsCall");
    cy.route({
      method: "DELETE",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPosting",
      status: 200,
      response: "Successfully Deleted",
    }).as("deleteJobPostingCall");
    cy.get("#MyJobPostings").click();
    cy.wait("@getJobPostingsCall").its("status").should("eq", 200);
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPostings",
      status: 200,
      response: [getJobPostingsSuccessResponse[1]],
    }).as("getJobPostingsCall");
    cy.get("#DeleteJobPosting1").click();
    cy.get("#confirmationConfirm").click();
    cy.get("body").should("not.contain", "Java 101");
    cy.contains("A job posting has been successfully deleted!");
  });

  it("Delete Job Postings CANCEL SUCCESS", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPostings",
      status: 200,
      response: getJobPostingsSuccessResponse,
    }).as("getJobPostingsCall");
    cy.route({
      method: "DELETE",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPosting",
      status: 200,
      response: "Successfully Deleted",
    }).as("deleteJobPostingCall");
    cy.get("#MyJobPostings").click();
    cy.wait("@getJobPostingsCall").its("status").should("eq", 200);
    cy.get("#DeleteJobPosting1").click();
    cy.get("#confirmationConfirm").click();
    cy.contains("title1");
  });

  it("Delete Job Postings FAILURE", () => {
    cy.route({
      method: "GET",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPostings",
      status: 200,
      response: getJobPostingsSuccessResponse,
    }).as("getJobPostingsCall");
    cy.route({
      method: "DELETE",
      url: Cypress.env("REACT_APP_SERVER_URL") + "/jobPosting",
      status: 400,
      response: "An error has occurred while trying to delete a job posting.",
    }).as("deleteJobPostingCall");
    cy.get("#MyJobPostings").click();
    cy.wait("@getJobPostingsCall").its("status").should("eq", 200);
    cy.get("#DeleteJobPosting1").click();
    cy.get("#confirmationConfirm").click();
    cy.contains("An error has occurred while trying to delete a job posting.");
  });
});
