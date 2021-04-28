const { connectDB, disconnectDB } = require("../util");
const search = require("../../src/services/search");
const JobPosting = require("../../src/models/jobPosting");
const Skill = require("../../src/models/skill");
const Course = require("../../src/models/course");

describe("Search service test", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  afterEach(async () => {
    await JobPosting.remove({});
    await Skill.remove({});
    await Course.remove({});
  });

  async function makeSkills() {
    let skills = [
      new Skill({ name: "S1" }),
      new Skill({ name: "S2" }),
      new Skill({ name: "S3" }),
      new Skill({ name: "S4" }),
      new Skill({ name: "S5" }),
    ];

    for (let skill of skills) {
      await skill.save();
    }
    return skills;
  }

  async function makeJobs() {
    let jobs = [
      new JobPosting({ jobTitle: "Job 1", zipCode: "12345" }),
      new JobPosting({ jobTitle: "Job 2", zipCode: "12345" }),
      new JobPosting({ jobTitle: "Job 3", zipCode: "12345" }),
      new JobPosting({ jobTitle: "Job 4", zipCode: "12345" }),
    ];

    for (let job of jobs) {
      await job.save();
    }
    return jobs;
  }

  async function makeCourses() {
    let courses = [
      new Course({ name: "Course 1" }),
      new Course({ name: "Course 2" }),
      new Course({ name: "A Course 3" }),
      new Course({ name: "A Course 4" }),
    ];

    for (let course of courses) {
      await course.save();
    }
    return courses;
  }

  it("findSkillsByZip", async () => {
    let skills = await makeSkills();
    let jobs = await makeJobs();

    await jobs[0].addSkills([skills[2]._id]);
    await jobs[1].addSkills([skills[2]._id, skills[1]._id]);
    await jobs[2].addSkills([skills[2]._id, skills[1]._id, skills[0]._id]);

    let result = await search.findSkillsByZip("12345");

    expect(result.length).toEqual(3);
    expect(result[0]._id).toEqual(skills[2]._id);
    expect(result[1]._id).toEqual(skills[1]._id);
    expect(result[2]._id).toEqual(skills[0]._id);
  });

  it("findCoursesBySkills - One search", async () => {
    let skills = await makeSkills();
    let courses = await makeCourses();

    await courses[0].addSkills([skills[2]._id]);
    await courses[1].addSkills([skills[2]._id, skills[1]._id]);
    await courses[2].addSkills([skills[2]._id, skills[1]._id, skills[0]._id]);

    let result = await search.findCoursesBySkills(skills[1]._id);

    expect(result.length).toEqual(2);
    expect(result[0]._id).toEqual(courses[1]._id);
    expect(result[1]._id).toEqual(courses[2]._id);
  });

  it("findCoursesBySkills - Multiple Search", async () => {
    let skills = await makeSkills();
    let courses = await makeCourses();

    await courses[0].addSkills([skills[2]._id]);
    await courses[1].addSkills([skills[2]._id, skills[1]._id]);
    await courses[2].addSkills([skills[2]._id, skills[0]._id]);
    await courses[3].addSkills([skills[1]._id]);

    let result = await search.findCoursesBySkills([
      skills[1]._id,
      skills[0]._id,
    ]);

    expect(result.length).toEqual(3);
    expect(result[0]._id).toEqual(courses[1]._id);
    expect(result[1]._id).toEqual(courses[2]._id);
    expect(result[2]._id).toEqual(courses[3]._id);
  });

  it("findCoursesBySkills - Partial name search", async () => {
    let skills = await makeSkills();
    let courses = await makeCourses();

    await courses[0].addSkills([skills[2]._id]);
    await courses[1].addSkills([skills[2]._id, skills[1]._id]);
    await courses[2].addSkills([skills[2]._id, skills[1]._id, skills[0]._id]);

    let result = await search.findCoursesBySkills(skills[1]._id, "A");

    expect(result.length).toEqual(1);
    expect(result[0]._id).toEqual(courses[2]._id);
  });

  it("findCoursesBySkills - Order by popularity", async () => {});
});
