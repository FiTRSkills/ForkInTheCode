const { connectDB, disconnectDB } = require("../util");
const supertest = require("supertest");
const app = require("../../src/app");
const Skill = require("../../src/models/skill");
const Course = require("../../src/models/course");
const request = supertest(app);

let employer_session_info = "";

describe("testing skill routes", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  it("GET /skills - gets all skills when there are none", async () => {
    const res = await request.get("/skills");
    expect(res.statusCode).toEqual(406);
    expect(res.text).toEqual("no skills exist");
  });

  it("GET /skills/search - gets all skills when there are none", async () => {
    const res = await request.get("/skills/search?zipCode=12345&organization=");
    expect(res.statusCode).toEqual(406);
    expect(res.text).toEqual("no skills exist");
  });

  it("GET /skills - gets all skills", async () => {
    await Skill.findOneOrCreate("Coding");
    const res = await request.get("/skills");
    expect(res.statusCode).toEqual(200);
    let body = JSON.parse(res.text);
    expect(body[0].name).toEqual("Coding");
  });

  it("GET /skills - gets all skills multiple", async () => {
    await Skill.findOneOrCreate("Engineering");
    const res = await request.get("/skills");
    expect(res.statusCode).toEqual(200);
    let body = JSON.parse(res.text);
    expect(body[0].name).toEqual("Coding");
    expect(body[1].name).toEqual("Engineering");
  });

  it("GET /skills/getSkill - no id sent", async () => {
    const res = await request.get("/skills/getSkill");
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual(
      '{"errors":[{"msg":"Must send a viable skill id","param":"id","location":"body"}]}'
    );
  });

  it("GET /skills/getSkill - get skill that doesnt exist", async () => {
    const res = await request.get("/skills/getSkill?id=12348");
    expect(res.statusCode).toEqual(406);
    expect(res.text).toEqual("skill does not exist");
  });

  it("GET /skills/getSkill - get skill", async () => {
    let skill = await Skill.findOneOrCreate("Coding");
    let course = new Course({
      name: "Programming 101",
      description: "How to code",
      skills: [skill],
    });
    course.save();
    const res = await request.get("/skills/getSkill?id=" + skill._id);
    expect(res.statusCode).toEqual(200);
    let body = JSON.parse(res.text);
    expect(body.skill.name).toEqual("Coding");
    expect(body.courses[0].name).toEqual("Programming 101");
  });

  it("GET /profile - employer user session", async () => {
    const registerres = await request
      .post("/register")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({
        email: "testemprofile@gmail.com",
        password: "chicken",
        usertype: "EmployerProfile",
      });
    const loginres = await request
      .post("/login")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({ email: "testemprofile@gmail.com", password: "chicken" });
    employer_session_info = loginres.header["set-cookie"];
  });

  it("GET /skills/search - get skills in zipcode", async () => {
    let chicken = await Skill.findOneOrCreate("Chicken");
    let pizza = await Skill.findOneOrCreate("Pizza");
    let pep = await Skill.findOneOrCreate("Pepperoni");
    await request
      .post("/jobPosting")
      .set("Cookie", [employer_session_info])
      .send({
        jobTitle: "Software Engineer",
        salary: "$60,000",
        location: "Online",
        zipCode: "12345",
        description: "This is a posting for a SE.",
        responsibilities: "Don't suck at coding.",
        skills: [chicken, pizza],
      });
    await request
      .post("/jobPosting")
      .set("Cookie", [employer_session_info])
      .send({
        jobTitle: "Software Engineer",
        salary: "$60,000",
        location: "Online",
        zipCode: "12345",
        description: "This is a posting for a SE.",
        responsibilities: "Don't suck at coding.",
        skills: [chicken, pep],
      });
    const res = await request.get("/skills/search?zipCode=12345");
    expect(res.statusCode).toEqual(200);
    let body = JSON.parse(res.text);
    expect(body[0].name).toEqual("Chicken");
  });

  it("POST /skills/createSkill - invalid information sent", async () => {
    const res = await request
      .post("/skills/createSkill")
      .set("Cookie", [employer_session_info])
      .send({
        name: "Chicken Noodle Soup",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual(
      '{"errors":[{"msg":"Must send a skill description","param":"description","location":"body"}]}'
    );
  });

  it("POST /skills/createSkill - success", async () => {
    const res = await request
      .post("/skills/createSkill")
      .set("Cookie", [employer_session_info])
      .send({
        name: "Chicken Noodle Soup",
        description: "The best soup of all time",
      });
    expect(res.statusCode).toEqual(200);
    let body = JSON.parse(res.text);
    expect(body._id.length).toEqual(24);
  });

  it("POST /skills/createSkill - skill already exists", async () => {
    const res = await request
      .post("/skills/createSkill")
      .set("Cookie", [employer_session_info])
      .send({
        name: "Chicken Noodle Soup",
        description: "The best soup of all time",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("Skill with that name already exists.");
  });
});
