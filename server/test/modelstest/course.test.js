const { connectDB, disconnectDB } = require("../util");
const Course = require("../../src/models/course");
const Skill = require("../../src/models/skill");

describe("Course Model Test", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  afterEach(async () => {
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
});
