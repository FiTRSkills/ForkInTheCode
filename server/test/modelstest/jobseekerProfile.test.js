const { connectDB, disconnectDB } = require("../util");
const JobSeekerProfile = require("../../src/models/JobSeekerProfile");
const Organization = require("../../src/models/organization");

describe("EducatorProfile Model Test", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  afterEach(async () => {
    await JobSeekerProfile.remove({});
    await Organization.remove({});
  });

  it("create profile - empty defaults", async () => {
    let profile = new JobSeekerProfile();
    await profile.save();

    let savedProfile = await JobSeekerProfile.findAndPopulateById(profile._id);
    expect(savedProfile.name.first).toEqual("");
    expect(savedProfile.name.last).toEqual("");
    expect(savedProfile.dateOfBirth).toBeNull();
    expect(savedProfile.career.length).toEqual(0);
    expect(savedProfile.education.length).toEqual(0);
  });

  it("create profile - with values", async () => {
    let profile = new JobSeekerProfile({
      name: {
        first: "Bob",
        last: "Smith",
      },
      dateOfBirth: new Date("01/01/2000"),
    });
    await profile.save();

    let savedProfile = await JobSeekerProfile.findAndPopulateById(profile._id);
    expect(savedProfile.name.first).toEqual("Bob");
    expect(savedProfile.name.last).toEqual("Smith");
    expect(savedProfile.dateOfBirth).toEqual(new Date("01/01/2000"));
    expect(savedProfile.career.length).toEqual(0);
    expect(savedProfile.education.length).toEqual(0);
  });

  it("edit profile - set top level values", async () => {
    let profile = new JobSeekerProfile({
      name: {
        first: "Bob",
        last: "Smith",
      },
      dateOfBirth: new Date("01/01/2000"),
    });
    await profile.save();

    let savedProfile = await JobSeekerProfile.findAndPopulateById(profile._id);
    savedProfile.name.first = "Joe";
    savedProfile.dateOfBirth = new Date("12/12/2012");
    await savedProfile.save();

    savedProfile = await JobSeekerProfile.findAndPopulateById(profile._id);
    expect(savedProfile.name.first).toEqual("Joe");
    expect(savedProfile.name.last).toEqual("Smith");
    expect(savedProfile.dateOfBirth).toEqual(new Date("12/12/2012"));
  });

  it("edit profile - string dates", async () => {
    let profile = new JobSeekerProfile({
      name: {
        first: "Bob",
        last: "Smith",
      },
      dateOfBirth: "01/01/2000",
    });
    await profile.save();

    let savedProfile = await JobSeekerProfile.findAndPopulateById(profile._id);
    savedProfile.name.first = "Joe";
    savedProfile.dateOfBirth = "12/12/2012";
    await savedProfile.save();

    savedProfile = await JobSeekerProfile.findAndPopulateById(profile._id);
    expect(savedProfile.name.first).toEqual("Joe");
    expect(savedProfile.name.last).toEqual("Smith");
    // Test it represents the correct actual date object
    expect(savedProfile.dateOfBirth).toEqual(new Date("12/12/2012"));
  });

  it("add education - new organization", async () => {
    let profile = new JobSeekerProfile();
    await profile.addEducation("Degree", "Major", "01/01/2020", "Org 1");

    let savedProfile = await JobSeekerProfile.findAndPopulateById(profile._id);
    expect(savedProfile.education.length).toEqual(1);
    let education = savedProfile.education[0];
    expect(education.degree).toEqual("Degree");
    expect(education.major).toEqual("Major");
    expect(education.gradDate).toEqual(new Date("01/01/2020"));
    expect(education.organization.name).toEqual("Org 1");
  });

  it("add education - existing organization", async () => {
    let organization = new Organization({ name: "Org 1" });
    await organization.save();
    let profile = new JobSeekerProfile();
    await profile.addEducation("Degree", "Major", "01/01/2020", "Org 1");

    let savedProfile = await JobSeekerProfile.findAndPopulateById(profile._id);
    expect(savedProfile.education.length).toEqual(1);
    let education = savedProfile.education[0];
    expect(education.degree).toEqual("Degree");
    expect(education.major).toEqual("Major");
    expect(education.gradDate).toEqual(new Date("01/01/2020"));
    expect(education.organization.name).toEqual(organization.name);
    expect(education.organization._id).toEqual(organization._id);
    let organizations = await Organization.find({}).exec();
    expect(organizations.length).toEqual(1);
  });

  it("remove education - existing education", async () => {
    let profile = new JobSeekerProfile();
    await profile.addEducation("Degree", "Major", "01/01/2020", "Org 1");
    await profile.addEducation("Degree2", "Major2", "02/02/2020", "Org 2");

    let savedProfile = await JobSeekerProfile.findAndPopulateById(profile._id);
    await savedProfile.removeEducation(0);
    expect(savedProfile.education.length).toEqual(1);
    let education = savedProfile.education[0];
    expect(education).toBeDefined();
    expect(education.degree).toEqual("Degree2");
    expect(education.major).toEqual("Major2");
    expect(education.gradDate).toEqual(new Date("02/02/2020"));
    expect(education.organization.name).toEqual("Org 2");
  });

  it("remove education - non existent education", async () => {
    let profile = new JobSeekerProfile();
    await profile.addEducation("Degree", "Major", "01/01/2020", "Org 1");

    let savedProfile = await JobSeekerProfile.findAndPopulateById(profile._id);
    await expect(savedProfile.removeEducation(1)).rejects.toThrow();
    expect(savedProfile.education.length).toEqual(1);
    let education = savedProfile.education[0];
    expect(education).toBeDefined();
    expect(education.degree).toEqual("Degree");
    expect(education.major).toEqual("Major");
    expect(education.gradDate).toEqual(new Date("01/01/2020"));
    expect(education.organization.name).toEqual("Org 1");
  });

  it("add job - new organization", async () => {
    let profile = new JobSeekerProfile();
    await profile.addJob("Worker", "Org 1");

    let savedProfile = await JobSeekerProfile.findAndPopulateById(profile._id);
    expect(savedProfile.career.length).toEqual(1);
    let job = savedProfile.career[0];
    expect(job.jobTitle).toEqual("Worker");
    expect(job.organization.name).toEqual("Org 1");
  });

  it("add job - existing organization", async () => {
    let organization = new Organization({ name: "Org 1" });
    await organization.save();
    let profile = new JobSeekerProfile();
    await profile.addJob("Worker", "Org 1");

    let savedProfile = await JobSeekerProfile.findAndPopulateById(profile._id);
    expect(savedProfile.career.length).toEqual(1);
    let job = savedProfile.career[0];
    expect(job.jobTitle).toEqual("Worker");
    expect(job.organization.name).toEqual(organization.name);
    expect(job.organization._id).toEqual(organization._id);
    let organizations = await Organization.find({}).exec();
    expect(organizations.length).toEqual(1);
  });

  it("remove job - existing job", async () => {
    let profile = new JobSeekerProfile();
    await profile.addJob("Worker", "Org 1");
    await profile.addJob("Worker2", "Org 2");

    let savedProfile = await JobSeekerProfile.findAndPopulateById(profile._id);
    await savedProfile.removeJob(0);
    expect(savedProfile.career.length).toEqual(1);
    let job = savedProfile.career[0];
    expect(job).toBeDefined();
    expect(job.jobTitle).toEqual("Worker2");
    expect(job.organization.name).toEqual("Org 2");
  });

  it("remove job - non existent job", async () => {
    let profile = new JobSeekerProfile();
    await profile.addJob("Worker", "Org 1");

    let savedProfile = await JobSeekerProfile.findAndPopulateById(profile._id);
    await expect(savedProfile.removeJob(1)).rejects.toThrow();
    expect(savedProfile.career.length).toEqual(1);
    let job = savedProfile.career[0];
    expect(job).toBeDefined();
    expect(job.jobTitle).toEqual("Worker");
    expect(job.organization.name).toEqual("Org 1");
  });
});
