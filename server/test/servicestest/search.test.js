const { connectDB, disconnectDB } = require("../util");
const search = require("../../src/services/search");
const JobPosting = require("../../src/models/jobPosting");
const Skill = require("../../src/models/skill");

describe("JobPosting Model Test", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  afterEach(async () => {
    await JobPosting.remove({});
    await Skill.remove({});
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

  it("findSkillsByZip", async () => {
    let skills = await makeSkills();
    let jobs = await makeJobs();

    await jobs[0].addSkills([skills[2].name]);
    await jobs[1].addSkills([skills[2].name, skills[1].name]);
    await jobs[2].addSkills([skills[2].name, skills[1].name, skills[0].name]);

    let result = await search.findSkillsByZip("12345");

    expect(result.length).toEqual(3);
    expect(result[0]._id).toEqual(skills[2]._id);
    expect(result[1]._id).toEqual(skills[1]._id);
    expect(result[2]._id).toEqual(skills[0]._id);
  });
});
