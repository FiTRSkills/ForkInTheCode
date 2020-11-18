const { connectDB, disconnectDB } = require("../util");
const supertest = require("supertest");
const app = require("../../src/app");
const request = supertest(app);

var session_info = "";
var education_id = "";
var career_id = "";
var skill_id = "";
var organization = "";

describe("testing index.js routes", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  it("GET /profile - no user session", async () => {
    const res = await request.get("/profile");
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("Access Denied.");
  });

  it("POST /profile - no user session", async () => {
    const res = await request.post("/profile");
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("Access Denied.");
  });

  it("GET /profile/usertype - no user session", async () => {
    const res = await request.get("/profile");
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("Access Denied.");
  });

  it("GET /profile - user session", async () => {
    const registerres = await request
      .post("/register")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({
        email: "testprofile@gmail.com",
        password: "chicken",
        usertype: "JobSeekerProfile",
      });
    const loginres = await request
      .post("/login")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({ email: "testprofile@gmail.com", password: "chicken" });

    const res = await request
      .get("/profile")
      .set("Cookie", [loginres.header["set-cookie"]]);
    session_info = loginres.header["set-cookie"];
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual(
      '{"firstname":"","lastname":"","dob":null,"education":[],"career":[],"skills":[]}'
    );
  });

  it("POST /profile - update the name profile", async () => {
    const res = await request
      .post("/profile")
      .set("Cookie", [session_info])
      .send({
        firstname: "Howard",
        lastname: "Rogers",
        dob: null,
        education: null,
        career: null,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Profile Updated.");
  });

  it("GET /profile - updated name profile information", async () => {
    const res = await request.get("/profile").set("Cookie", [session_info]);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual(
      '{"firstname":"Howard","lastname":"Rogers","dob":null,"education":[],"career":[],"skills":[]}'
    );
  });

  it("POST /profile - update the dob profile", async () => {
    const res = await request
      .post("/profile")
      .set("Cookie", [session_info])
      .send({
        firstname: "Howard",
        lastname: "Rogers",
        dob: "1923/09/19",
        education: null,
        career: null,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Profile Updated.");
  });

  it("GET /profile - updated dob profile information", async () => {
    const res = await request.get("/profile").set("Cookie", [session_info]);
    expect(res.statusCode).toEqual(200);
    let body = JSON.parse(res.text);
    expect(body.firstname).toEqual("Howard");
    expect(body.lastname).toEqual("Rogers");
    let date = new Date(body.dob);
    //months are 0-11 in json date format for some ungodly reason
    expect(date.getMonth()).toEqual(8);
    expect(date.getDate()).toEqual(19);
    expect(date.getFullYear()).toEqual(1923);
  });

  it("POST /profile/education - add education information", async () => {
    const res = await request
      .post("/profile/education")
      .set("Cookie", [session_info])
      .send({
        degree: "Bachelors",
        major: "Software Engineering",
        gradDate: "2021/05/07",
        organization: "RIT",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Successfully added education.");
  });

  it("GET /profile - added education information", async () => {
    const res = await request.get("/profile").set("Cookie", [session_info]);
    expect(res.statusCode).toEqual(200);
    let body = JSON.parse(res.text);
    expect(body.firstname).toEqual("Howard");
    expect(body.lastname).toEqual("Rogers");
    let date = new Date(body.dob);
    expect(date.getMonth()).toEqual(8);
    expect(date.getDate()).toEqual(19);
    expect(date.getFullYear()).toEqual(1923);
    education_id = body.education[0]._id;
    expect(body.education[0].degree).toEqual("Bachelors");
    expect(body.education[0].major).toEqual("Software Engineering");
    expect(body.education[0].organization.name).toEqual("RIT");
    organization = body.education[0].organization;
    let gradDate = new Date(body.education[0].gradDate);
    expect(gradDate.getMonth()).toEqual(4);
    expect(gradDate.getDate()).toEqual(7);
    expect(gradDate.getFullYear()).toEqual(2021);
  });

  it("PATCH /profile/education - change education information", async () => {
    const res = await request
      .patch("/profile/education")
      .set("Cookie", [session_info])
      .send({
        id: education_id,
        degree: "Bachelors",
        major: "Computer Science",
        gradDate: "2021/05/07",
        organization: "McDonalds",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Successfully edited education.");
  });

  it("GET /profile - change education information", async () => {
    const res = await request.get("/profile").set("Cookie", [session_info]);
    expect(res.statusCode).toEqual(200);
    let body = JSON.parse(res.text);
    expect(body.firstname).toEqual("Howard");
    expect(body.lastname).toEqual("Rogers");
    let date = new Date(body.dob);
    expect(date.getMonth()).toEqual(8);
    expect(date.getDate()).toEqual(19);
    expect(date.getFullYear()).toEqual(1923);
    expect(body.education[0].degree).toEqual("Bachelors");
    expect(body.education[0].major).toEqual("Computer Science");
    expect(body.education[0].organization.name).toEqual("McDonalds");
    let gradDate = new Date(body.education[0].gradDate);
    expect(gradDate.getMonth()).toEqual(4);
    expect(gradDate.getDate()).toEqual(7);
    expect(gradDate.getFullYear()).toEqual(2021);
  });

  it("DELETE /profile/education - delete education information", async () => {
    const res = await request
      .delete("/profile/education")
      .set("Cookie", [session_info])
      .send({
        id: education_id,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Successfully removed education.");
  });

  it("GET /profile - deleted education information", async () => {
    const res = await request.get("/profile").set("Cookie", [session_info]);
    expect(res.statusCode).toEqual(200);
    let body = JSON.parse(res.text);
    expect(body.firstname).toEqual("Howard");
    expect(body.lastname).toEqual("Rogers");
    let date = new Date(body.dob);
    expect(date.getMonth()).toEqual(8);
    expect(date.getDate()).toEqual(19);
    expect(date.getFullYear()).toEqual(1923);
    expect(body.education).toEqual([]);
  });

  it("POST /profile/career - add career information", async () => {
    const res = await request
      .post("/profile/career")
      .set("Cookie", [session_info])
      .send({
        jobTitle: "Senior Software Engineer",
        startDate: "2008/09/10",
        endDate: "2019/02/07",
        organization: "RIT",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Successfully added career.");
  });

  it("GET /profile - added career information", async () => {
    const res = await request.get("/profile").set("Cookie", [session_info]);
    expect(res.statusCode).toEqual(200);
    let body = JSON.parse(res.text);
    expect(body.firstname).toEqual("Howard");
    expect(body.lastname).toEqual("Rogers");
    let date = new Date(body.dob);
    expect(date.getMonth()).toEqual(8);
    expect(date.getDate()).toEqual(19);
    expect(date.getFullYear()).toEqual(1923);
    career_id = body.career[0]._id;
    expect(body.career[0].jobTitle).toEqual("Senior Software Engineer");
    expect(body.career[0].organization.name).toEqual("RIT");
    let startDate = new Date(body.career[0].startDate);
    expect(startDate.getMonth()).toEqual(8);
    expect(startDate.getDate()).toEqual(10);
    expect(startDate.getFullYear()).toEqual(2008);
    let endDate = new Date(body.career[0].endDate);
    expect(endDate.getMonth()).toEqual(1);
    expect(endDate.getDate()).toEqual(7);
    expect(endDate.getFullYear()).toEqual(2019);
  });

  it("PATCH /profile/career - change career information", async () => {
    const res = await request
      .patch("/profile/career")
      .set("Cookie", [session_info])
      .send({
        id: career_id,
        jobTitle: "Junior Software Engineer",
        startDate: "2008/09/10",
        endDate: "2019/02/07",
        organization: "BoigerKing",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Successfully edited career.");
  });

  it("GET /profile - change career information", async () => {
    const res = await request.get("/profile").set("Cookie", [session_info]);
    expect(res.statusCode).toEqual(200);
    let body = JSON.parse(res.text);
    expect(body.firstname).toEqual("Howard");
    expect(body.lastname).toEqual("Rogers");
    let date = new Date(body.dob);
    expect(date.getMonth()).toEqual(8);
    expect(date.getDate()).toEqual(19);
    expect(date.getFullYear()).toEqual(1923);
    expect(body.career[0].jobTitle).toEqual("Junior Software Engineer");
    expect(body.career[0].organization.name).toEqual("BoigerKing");
    let startDate = new Date(body.career[0].startDate);
    expect(startDate.getMonth()).toEqual(8);
    expect(startDate.getDate()).toEqual(10);
    expect(startDate.getFullYear()).toEqual(2008);
    let endDate = new Date(body.career[0].endDate);
    expect(endDate.getMonth()).toEqual(1);
    expect(endDate.getDate()).toEqual(7);
    expect(endDate.getFullYear()).toEqual(2019);
  });

  it("DELETE /profile/career - delete career information", async () => {
    const res = await request
      .delete("/profile/career")
      .set("Cookie", [session_info])
      .send({
        id: career_id,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Successfully removed career.");
  });

  it("GET /profile - deleted career information", async () => {
    const res = await request.get("/profile").set("Cookie", [session_info]);
    expect(res.statusCode).toEqual(200);
    let body = JSON.parse(res.text);
    expect(body.firstname).toEqual("Howard");
    expect(body.lastname).toEqual("Rogers");
    let date = new Date(body.dob);
    expect(date.getMonth()).toEqual(8);
    expect(date.getDate()).toEqual(19);
    expect(date.getFullYear()).toEqual(1923);
    expect(body.career).toEqual([]);
  });

  it("POST /profile/skill - add skill information", async () => {
    const res = await request
      .post("/profile/skill")
      .set("Cookie", [session_info])
      .send({
        skill: "C++",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Successfully added skill.");
  });

  it("GET /profile - added skill information", async () => {
    const res = await request.get("/profile").set("Cookie", [session_info]);
    expect(res.statusCode).toEqual(200);
    let body = JSON.parse(res.text);
    expect(body.firstname).toEqual("Howard");
    expect(body.lastname).toEqual("Rogers");
    let date = new Date(body.dob);
    expect(date.getMonth()).toEqual(8);
    expect(date.getDate()).toEqual(19);
    expect(date.getFullYear()).toEqual(1923);
    skill_id = body.skills[0]._id;
    expect(body.skills[0].name).toEqual("C++");
  });

  it("DELETE /profile/skill - delete skill information", async () => {
    const res = await request
      .delete("/profile/skill")
      .set("Cookie", [session_info])
      .send({
        id: skill_id,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Successfully removed skill.");
  });

  it("GET /profile - removed skill information", async () => {
    const res = await request.get("/profile").set("Cookie", [session_info]);
    expect(res.statusCode).toEqual(200);
    let body = JSON.parse(res.text);
    expect(body.firstname).toEqual("Howard");
    expect(body.lastname).toEqual("Rogers");
    let date = new Date(body.dob);
    expect(date.getMonth()).toEqual(8);
    expect(date.getDate()).toEqual(19);
    expect(date.getFullYear()).toEqual(1923);
    expect(body.skills).toEqual([]);
  });

  it("GET /profile/usertype", async () => {
    const res = await request
      .get("/profile/usertype")
      .set("Cookie", [session_info]);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("JobSeekerProfile");
  });
});
