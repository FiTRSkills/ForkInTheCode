const { connectDB, disconnectDB } = require("../util");
const JobPosting = require("../../src/models/jobPosting");
const Organization = require("../../src/models/organization");
const Skill = require("../../src/models/skill");

describe("JobPosting Model Test", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  afterEach(async () => {
    await JobPosting.remove({});
    await Organization.remove({});
    await Skill.remove({});
  });

  async function makeSkills() {
    let skills = [
      new Skill({ name: "S1" }),
      new Skill({ name: "S2" }),
      new Skill({ name: "S3" }),
    ];

    for (let skill of skills) {
      await skill.save();
    }
    return skills;
  }

  it("create job posting - with data", async () => {
    let organization = new Organization({ name: "Org 1" });
    await organization.save();
    let skills = await makeSkills();

    let jobPosting = new JobPosting({
      jobTitle: "Job 1",
      zipCode: "12345",
      pay: "$1",
      code: "abc-123",
      description: "Job 1 Description",
      qualifications: "Experience",
      organization: organization._id,
      skills: skills.map((skill) => skill._id),
    });
    await jobPosting.save();

    jobPosting = await JobPosting.getJobPosting(jobPosting._id);

    expect(jobPosting.jobTitle).toEqual("Job 1");
    expect(jobPosting.zipCode).toEqual("12345");
    expect(jobPosting.pay).toEqual("$1");
    expect(jobPosting.code).toEqual("abc-123");
    expect(jobPosting.description).toEqual("Job 1 Description");
    expect(jobPosting.qualifications).toEqual("Experience");
    expect(jobPosting.organization.name).toEqual(organization.name);
    expect(jobPosting.organization._id).toEqual(organization._id);
    expect(jobPosting.skills.length).toEqual(skills.length);
    for (let i = 0; i < jobPosting.skills.length; i++) {
      expect(jobPosting.skills[i].name).toEqual(skills[i].name);
    }
  });

  it("search job posting - no postings", async () => {
    let jobPostings = await JobPosting.search({});

    expect(jobPostings.length).toEqual(0);
  });

  it("search job posting - no filters", async () => {
    let jobPosting1 = new JobPosting({ zipCode: "12345" });
    await jobPosting1.save();
    let jobPosting2 = new JobPosting({ zipCode: "98765" });
    await jobPosting2.save();

    let jobPostings = await JobPosting.search({});
    expect(jobPostings.length).toEqual(2);
  });

  it("search job posting - zip code filter", async () => {
    let jobPosting1 = new JobPosting({ zipCode: "12345" });
    await jobPosting1.save();
    let jobPosting2 = new JobPosting({ zipCode: "98765" });
    await jobPosting2.save();

    let jobPostings = await JobPosting.search({ zipCode: "12345" });
    expect(jobPostings.length).toEqual(1);
    expect(jobPostings[0]._id).toEqual(jobPosting1._id);
  });

  it("search job posting - skills filter", async () => {
    let skills = await makeSkills();
    let skills1 = skills.slice(0, 1).map((skill) => skill._id);
    let skills2 = skills.slice(1, 2).map((skill) => skill._id);

    let jobPosting1 = new JobPosting({ skills: skills1 });
    await jobPosting1.save();
    let jobPosting2 = new JobPosting({ skills: skills2 });
    await jobPosting2.save();

    let jobPostings = await JobPosting.search({ skills: skills1 });
    expect(jobPostings.length).toEqual(1);
    expect(jobPostings[0]._id).toEqual(jobPosting1._id);

    jobPostings = await JobPosting.search({ skills: skills2 });
    expect(jobPostings.length).toEqual(1);
    expect(jobPostings[0]._id).toEqual(jobPosting2._id);

    jobPostings = await JobPosting.search({ skills: [skills[1]._id] });
    expect(jobPostings.length).toEqual(1);
    expect(jobPostings[0]._id).toEqual(jobPosting2._id);
  });

  it("search job posting - combined filters", async () => {
    let skills = await makeSkills();
    let skills1 = skills.slice(0, 1).map((skill) => skill._id);
    let skills2 = skills.slice(1, 2).map((skill) => skill._id);

    let jobPosting1 = new JobPosting({ zipCode: "12345", skills: skills1 });
    await jobPosting1.save();
    let jobPosting2 = new JobPosting({ zipCode: "98765", skills: skills2 });
    await jobPosting2.save();

    let jobPostings = await JobPosting.search({
      zipCode: "12345",
      skills: skills1,
    });
    expect(jobPostings.length).toEqual(1);
    expect(jobPostings[0]._id).toEqual(jobPosting1._id);

    jobPostings = await JobPosting.search({
      zipCode: "98765",
      skills: skills2,
    });
    expect(jobPostings.length).toEqual(1);
    expect(jobPostings[0]._id).toEqual(jobPosting2._id);

    jobPostings = await JobPosting.search({
      zipCode: "98765",
      skills: [skills[1]._id],
    });
    expect(jobPostings.length).toEqual(1);
    expect(jobPostings[0]._id).toEqual(jobPosting2._id);

    jobPostings = await JobPosting.search({
      zipCode: "98765",
      skills: skills1,
    });
    expect(jobPostings.length).toEqual(0);
  });

  it("set organization - new organization", async () => {
    let jobPosting = new JobPosting();
    await jobPosting.setOrganization("Org 1");

    let savedJobPosting = await JobPosting.getJobPosting(jobPosting._id);
    expect(savedJobPosting.organization.name).toEqual("Org 1");
  });

  it("set organization - existing organization", async () => {
    let organization = new Organization({ name: "Org 1" });
    await organization.save();
    let jobPosting = new JobPosting();
    await jobPosting.setOrganization("Org 1");

    let savedJobPosting = await JobPosting.getJobPosting(jobPosting._id);
    expect(savedJobPosting.organization.name).toEqual("Org 1");
    let organizations = await Organization.find({}).exec();
    expect(organizations.length).toEqual(1);
  });

  it("add skills - single skill", async () => {
    let skills = await makeSkills();
    let jobPosting = new JobPosting();
    await jobPosting.addSkills(["S1"]);

    let savedJobPosting = await JobPosting.getJobPosting(jobPosting._id);
    expect(savedJobPosting.skills.length).toEqual(1);
    expect(savedJobPosting.skills[0]._id).toEqual(skills[0]._id);
    let savedSkills = await Skill.find({}).exec();
    expect(savedSkills.length).toEqual(3);
  });

  it("add skills - multiple skills", async () => {
    let skills = await makeSkills();
    let jobPosting = new JobPosting();
    await jobPosting.addSkills(["S1", "S4"]);

    let savedJobPosting = await JobPosting.getJobPosting(jobPosting._id);
    expect(savedJobPosting.skills.length).toEqual(2);
    expect(savedJobPosting.skills[0]._id).toEqual(skills[0]._id);
    let savedSkills = await Skill.find({}).exec();
    expect(savedSkills.length).toEqual(4);
  });
});
