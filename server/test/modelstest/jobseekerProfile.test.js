const { connectDB, disconnectDB } = require("../util");
const JobSeekerProfile = require("../../src/models/jobseekerProfile");
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

    let savedProfile = await JobSeekerProfile.findById(profile._id).exec();
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

    let savedProfile = await JobSeekerProfile.findById(profile._id).exec();
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

    let savedProfile = await JobSeekerProfile.findById(profile._id).exec();
    savedProfile.name.first = "Joe";
    savedProfile.dateOfBirth = new Date("12/12/2012");
    await savedProfile.save();

    savedProfile = await JobSeekerProfile.findById(profile._id).exec();
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

    let savedProfile = await JobSeekerProfile.findById(profile._id).exec();
    savedProfile.name.first = "Joe";
    savedProfile.dateOfBirth = "12/12/2012";
    await savedProfile.save();

    savedProfile = await JobSeekerProfile.findById(profile._id).exec();
    expect(savedProfile.name.first).toEqual("Joe");
    expect(savedProfile.name.last).toEqual("Smith");
    // Test it represents the correct actual date object
    expect(savedProfile.dateOfBirth).toEqual(new Date("12/12/2012"));
  });

  it("add education - new organization", async () => {
    let profile = new JobSeekerProfile();
    await profile.addEducation("Degree", "Major", "01/01/2020", "Org 1");

    let savedProfile = await JobSeekerProfile.findById(profile._id).exec();
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

    let savedProfile = await JobSeekerProfile.findById(profile._id).exec();
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

    let savedProfile = await JobSeekerProfile.findById(profile._id).exec();
    let education = savedProfile.education[0];
    await savedProfile.removeEducation(education._id);
    education = savedProfile.education[0];

    expect(savedProfile.education.length).toEqual(1);
    expect(education).toBeDefined();
    expect(education.degree).toEqual("Degree2");
    expect(education.major).toEqual("Major2");
    expect(education.gradDate).toEqual(new Date("02/02/2020"));
    expect(education.organization.name).toEqual("Org 2");
  });

  it("remove education - non existent education", async () => {
    let profile = new JobSeekerProfile();
    await profile.addEducation("Degree", "Major", "01/01/2020", "Org 1");

    let savedProfile = await JobSeekerProfile.findById(profile._id).exec();
    await expect(savedProfile.removeEducation("N/A")).rejects.toThrow();
    let education = savedProfile.education[0];

    expect(savedProfile.education.length).toEqual(1);
    expect(education).toBeDefined();
    expect(education.degree).toEqual("Degree");
    expect(education.major).toEqual("Major");
    expect(education.gradDate).toEqual(new Date("01/01/2020"));
    expect(education.organization.name).toEqual("Org 1");
  });

  it("add career - new organization", async () => {
    let profile = new JobSeekerProfile();
    await profile.addCareer("Worker", "01/01/2020", "01/01/2021", "Org 1");

    let savedProfile = await JobSeekerProfile.findById(profile._id).exec();
    let career = savedProfile.career[0];

    expect(savedProfile.career.length).toEqual(1);
    expect(career.jobTitle).toEqual("Worker");
    expect(career.startDate).toEqual(new Date("01/01/2020"));
    expect(career.endDate).toEqual(new Date("01/01/2021"));
    expect(career.organization.name).toEqual("Org 1");
  });

  it("add career - existing organization", async () => {
    let organization = new Organization({ name: "Org 1" });
    await organization.save();
    let profile = new JobSeekerProfile();
    await profile.addCareer("Worker", "01/01/2020", "01/01/2021", "Org 1");

    let savedProfile = await JobSeekerProfile.findById(profile._id).exec();
    let career = savedProfile.career[0];
    let organizations = await Organization.find({}).exec();

    expect(savedProfile.career.length).toEqual(1);
    expect(career.jobTitle).toEqual("Worker");
    expect(career.startDate).toEqual(new Date("01/01/2020"));
    expect(career.endDate).toEqual(new Date("01/01/2021"));
    expect(career.organization.name).toEqual(organization.name);
    expect(career.organization._id).toEqual(organization._id);
    expect(organizations.length).toEqual(1);
  });

  it("remove career - existing career", async () => {
    let profile = new JobSeekerProfile();
    await profile.addCareer("Worker", "01/01/2020", "01/01/2021", "Org 1");
    await profile.addCareer("Worker2", "01/01/2020", "01/01/2021", "Org 2");

    let savedProfile = await JobSeekerProfile.findById(profile._id).exec();
    let career = savedProfile.career[0];
    await savedProfile.removeCareer(career._id);
    career = savedProfile.career[0];

    expect(savedProfile.career.length).toEqual(1);
    expect(career).toBeDefined();
    expect(career.jobTitle).toEqual("Worker2");
    expect(career.startDate).toEqual(new Date("01/01/2020"));
    expect(career.endDate).toEqual(new Date("01/01/2021"));
    expect(career.organization.name).toEqual("Org 2");
  });

  it("remove career - non existent career", async () => {
    let profile = new JobSeekerProfile();
    await profile.addCareer("Worker", "01/01/2020", "01/01/2021", "Org 1");

    let savedProfile = await JobSeekerProfile.findById(profile._id).exec();
    await expect(savedProfile.removeCareer("N/A")).rejects.toThrow();
    let career = savedProfile.career[0];

    expect(savedProfile.career.length).toEqual(1);
    expect(career).toBeDefined();
    expect(career.jobTitle).toEqual("Worker");
    expect(career.startDate).toEqual(new Date("01/01/2020"));
    expect(career.endDate).toEqual(new Date("01/01/2021"));
    expect(career.organization.name).toEqual("Org 1");
  });
});
