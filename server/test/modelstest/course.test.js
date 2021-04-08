const { connectDB, disconnectDB } = require("../util");
const Course = require("../../src/models/course");
const Skill = require("../../src/models/skill");
const Organization = require("../../src/models/organization");

describe("Course Model Test", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  afterEach(async () => {
    await Course.remove({});
    await Skill.remove({});
    await Organization.remove({});
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

  it("create course - empty defaults", async () => {
    let course = new Course();
    await course.save();

    let savedCourse = await Course.findById(course._id).exec();

    expect(savedCourse.name).toEqual("");
    expect(savedCourse.description).toEqual("");
    expect(savedCourse.skills.length).toEqual(0);
  });

  it("create course - with values", async () => {
    let skills = await makeSkills();
    let course = new Course({
      name: "Course 1",
      description: "Description",
      skills: [skills[0], skills[1]],
    });
    await course.save();

    let savedCourse = await Course.findById(course._id).exec();

    expect(savedCourse.name).toEqual("Course 1");
    expect(savedCourse.description).toEqual("Description");
    expect(savedCourse.skills.length).toEqual(2);
  });

  it("edit course - set top level values", async () => {
    let course = new Course({
      name: "Course 1",
      description: "Description 1",
    });
    await course.save();

    let savedCourse = await Course.findById(course._id).exec();
    savedCourse.name = "Course 2";
    savedCourse.description = "Description 2";
    await savedCourse.save();
    savedCourse = await Course.findById(course._id).exec();

    expect(savedCourse.name).toEqual("Course 2");
    expect(savedCourse.description).toEqual("Description 2");
  });

  it("set organization - once", async () => {
    let course = new Course();
    await course.setOrganization("Org 1");

    let savedCourse = await Course.findById(course._id);
    expect(savedCourse.organization.name).toEqual("Org 1");
  });

  it("set organization - twice", async () => {
    let course = new Course();
    await course.setOrganization("Org 1");
    await course.setOrganization("Org 2");

    let savedCourse = await Course.findById(course._id);
    expect(savedCourse.organization.name).toEqual("Org 2");
    let organizations = await Organization.find({}).exec();
    expect(organizations.length).toEqual(2);
  });

  it("set organization - existing organization", async () => {
    let organization = new Organization({ name: "Org 1" });
    await organization.save();
    let course = new Course();
    await course.setOrganization("Org 1");

    let savedCourse = await Course.findById(course._id);
    expect(savedCourse.organization.name).toEqual("Org 1");
    let organizations = await Organization.find({}).exec();
    expect(organizations.length).toEqual(1);
  });

  it("add skills - single skill", async () => {
    let skills = await makeSkills();
    let course = new Course();
    await course.addSkills(skills[0]._id.toString());

    let savedCourse = await Course.findById(course._id);
    expect(savedCourse.skills.length).toEqual(1);
    expect(savedCourse.skills[0]._id).toEqual(skills[0]._id);
  });

  it("add skills - multiple skills", async () => {
    let skills = await makeSkills();
    let course = new Course();
    await course.addSkills([
      skills[0]._id.toString(),
      skills[1]._id.toString(),
    ]);

    let savedCourse = await Course.findById(course._id);
    expect(savedCourse.skills.length).toEqual(2);
    expect(savedCourse.skills[0]._id).toEqual(skills[0]._id);
    expect(savedCourse.skills[1]._id).toEqual(skills[1]._id);
  });

  it("remove skill - existing skill", async () => {
    let skills = await makeSkills();
    let course = new Course();
    await course.addSkills([
      skills[0]._id.toString(),
      skills[1]._id.toString(),
    ]);

    let savedCourse = await Course.findById(course._id).exec();
    await savedCourse.removeSkill(skills[0]._id);

    expect(savedCourse.skills.length).toEqual(1);
    expect(savedCourse.skills[0]._id).toEqual(skills[1]._id);
  });

  it("remove skill - non existent skill", async () => {
    let skills = await makeSkills();
    let course = new Course();
    await course.addSkills([skills[1]._id.toString()]);

    let savedCourse = await Course.findById(course._id).exec();
    await savedCourse.removeSkill(skills[0]._id);

    expect(savedCourse.skills.length).toEqual(1);
    expect(savedCourse.skills[0]._id).toEqual(skills[1]._id);
  });
});
