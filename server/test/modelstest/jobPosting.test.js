const { connectDB, disconnectDB } = require("../util");
const JobPosting = require("../../src/models/jobPosting");
const Organization = require("../../src/models/organization");
const Skill = require("../../src/models/skill");
const Course = require("../../src/models/course");

describe("JobPosting Model Test", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  afterEach(async () => {
    await JobPosting.remove({});
    await Organization.remove({});
    await Skill.remove({});
    await Course.remove({});
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

  async function makeCourses() {
    let courses = [
      new Course({ name: "Course 1" }),
      new Course({ name: "Course 2" }),
      new Course({ name: "Course 3" }),
    ];

    for (let course of courses) {
      await course.save();
    }
    return courses;
  }

  it("create job posting - with data", async () => {
    let organization = new Organization({ name: "Org 1" });
    await organization.save();
    let skills = await makeSkills();

    let jobPosting = new JobPosting({
      jobTitle: "Job 1",
      zipCode: "12345",
      salary: "$1",
      benefits: "15 Vacation Days",
      description: "Job 1 Description",
      amountOfJobs: "3 Positions",
      jobTimeline: "Start in 2 weeks",
      responsibilities: "A, B, C",
      organization: organization._id,
      skills: skills.map((skill) => skill._id),
    });
    await jobPosting.save();

    jobPosting = await JobPosting.getJobPosting(jobPosting._id);

    expect(jobPosting.jobTitle).toEqual("Job 1");
    expect(jobPosting.zipCode).toEqual("12345");
    expect(jobPosting.salary).toEqual("$1");
    expect(jobPosting.benefits).toEqual("15 Vacation Days");
    expect(jobPosting.description).toEqual("Job 1 Description");
    expect(jobPosting.amountOfJobs).toEqual("3 Positions");
    expect(jobPosting.jobTimeline).toEqual("Start in 2 weeks");
    expect(jobPosting.responsibilities).toEqual("A, B, C");
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
    await jobPosting.addSkills(skills[0]._id.toString());

    let savedJobPosting = await JobPosting.getJobPosting(jobPosting._id);
    expect(savedJobPosting.skills.length).toEqual(1);
    expect(savedJobPosting.skills[0]._id).toEqual(skills[0]._id);
    let savedSkills = await Skill.find({}).exec();
    expect(savedSkills.length).toEqual(3);
  });

  it("add skills - multiple skills", async () => {
    let skills = await makeSkills();
    let jobPosting = new JobPosting();
    await jobPosting.addSkills([
      skills[0]._id.toString(),
      skills[1]._id.toString(),
    ]);

    let savedJobPosting = await JobPosting.getJobPosting(jobPosting._id);
    expect(savedJobPosting.skills.length).toEqual(2);
    expect(savedJobPosting.skills[0]._id).toEqual(skills[0]._id);
    expect(savedJobPosting.skills[1]._id).toEqual(skills[1]._id);
  });

  it("remove skill - existing skill", async () => {
    let skills = await makeSkills();
    let jobPosting = new JobPosting();
    await jobPosting.addSkills([
      skills[0]._id.toString(),
      skills[1]._id.toString(),
    ]);

    let savedJobPosting = await JobPosting.findById(jobPosting._id).exec();
    await savedJobPosting.removeSkill(skills[0]._id);

    expect(savedJobPosting.skills.length).toEqual(1);
    expect(savedJobPosting.skills[0]._id).toEqual(skills[1]._id);
  });

  it("remove skill - non existent skill", async () => {
    let skills = await makeSkills();
    let jobPosting = new JobPosting();
    await jobPosting.addSkills([skills[1]._id.toString()]);

    let savedJobPosting = await JobPosting.findById(jobPosting._id).exec();
    await savedJobPosting.removeSkill(skills[0]._id);

    expect(savedJobPosting.skills.length).toEqual(1);
    expect(savedJobPosting.skills[0]._id).toEqual(skills[1]._id);
  });

  it("add courses - single course", async () => {
    let courses = await makeCourses();
    let jobPosting = new JobPosting();
    await jobPosting.addCourses(courses[0]._id.toString());

    let savedJobPosting = await JobPosting.getJobPosting(jobPosting._id);
    expect(savedJobPosting.courses.length).toEqual(1);
    expect(savedJobPosting.courses[0]._id).toEqual(courses[0]._id);
  });

  it("add courses - multiple courses", async () => {
    let courses = await makeCourses();
    let jobPosting = new JobPosting();
    await jobPosting.addCourses([
      courses[0]._id.toString(),
      courses[1]._id.toString(),
    ]);

    let savedJobPosting = await JobPosting.getJobPosting(jobPosting._id);
    expect(savedJobPosting.courses.length).toEqual(2);
    expect(savedJobPosting.courses[0]._id).toEqual(courses[0]._id);
    expect(savedJobPosting.courses[1]._id).toEqual(courses[1]._id);
  });

  it("remove course - existing course", async () => {
    let courses = await makeCourses();
    let jobPosting = new JobPosting();
    await jobPosting.addCourses([
      courses[0]._id.toString(),
      courses[1]._id.toString(),
    ]);

    let savedJobPosting = await JobPosting.findById(jobPosting._id).exec();
    await savedJobPosting.removeCourse(courses[0]._id);

    expect(savedJobPosting.courses.length).toEqual(1);
    expect(savedJobPosting.courses[0]._id).toEqual(courses[1]._id);
  });

  it("remove course - non existent course", async () => {
    let courses = await makeCourses();
    let jobPosting = new JobPosting();
    await jobPosting.addCourses([courses[1]._id.toString()]);

    let savedJobPosting = await JobPosting.findById(jobPosting._id).exec();
    await savedJobPosting.removeCourse(courses[0]._id);

    expect(savedJobPosting.courses.length).toEqual(1);
    expect(savedJobPosting.courses[0]._id).toEqual(courses[1]._id);
  });
});
