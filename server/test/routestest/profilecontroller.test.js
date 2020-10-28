const { connectDB, disconnectDB } = require("../util");
const supertest = require("supertest");
const app = require("../../src/app");
const request = supertest(app);

var session_info = "";

describe("testing index.js routes", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  it("GET /profile - no user session", async () => {
    const res = await request
      .get("/profile")
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("Access Denied.");
  });

  it("POST /profile - no user session", async () => {
    const res = await request
      .post("/profile")
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
      .set("Cookie", [loginres.header['set-cookie']])
    session_info = loginres.header['set-cookie']
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("{\"firstname\":\"\",\"lastname\":\"\",\"dob\":null,\"education\":[],\"career\":[]}");
  });

  it("POST /profile - update the name profile", async () => {
    const res = await request
      .post("/profile")
      .set("Cookie", [session_info])
      .send({ firstname: "Howard", lastname: "Rogers", dob: null, education: null, career: null})
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Profile Updated.");
  });

  it("GET /profile - updated name profile information", async () => {
    const res = await request
      .get("/profile")
      .set("Cookie", [session_info])
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("{\"firstname\":\"Howard\",\"lastname\":\"Rogers\",\"dob\":null,\"education\":[],\"career\":[]}");
  });

  it("POST /profile - update the dob profile", async () => {
    const res = await request
      .post("/profile")
      .set("Cookie", [session_info])
      .send({ firstname: "Howard", lastname: "Rogers", dob: "1923/09/19", education: null, career: null})
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Profile Updated.");
  });

  it("GET /profile - updated dob profile information", async () => {
    const res = await request
      .get("/profile")
      .set("Cookie", [session_info])
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("{\"firstname\":\"Howard\",\"lastname\":\"Rogers\",\"dob\":\"1923-09-19T04:00:00.000Z\",\"education\":[],\"career\":[]}");
  });

  it("POST /profile - update the profile education", async () => {
    const res = await request
      .post("/profile")
      .set("Cookie", [session_info])
      .send({ firstname: "Howard", lastname: "Rogers", dob: "1923/09/19", education: [{degree: "Bachelors", major: "Software Engineering", gradDate: "2018/05/21", institution: "RIT"}], career: null});
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Profile Updated.");
  });

  it("GET /profile - updated education profile information", async () => {
    const res = await request
      .get("/profile")
      .set("Cookie", [session_info])
    expect(res.statusCode).toEqual(200);
    let body = JSON.parse(res.text);
    expect(body.firstname).toEqual('Howard');
    expect(body.lastname).toEqual('Rogers');
    expect(body.dob).toEqual('1923-09-19T04:00:00.000Z');
    expect(body.education[0].degree).toEqual('Bachelors');
    expect(body.education[0].major).toEqual('Software Engineering');
    expect(body.education[0].gradDate).toEqual('2018-05-21T04:00:00.000Z');
    expect(body.education[0].institution.name).toEqual('RIT');
  });

  it("POST /profile - update the profile career", async () => {
    const res = await request
      .post("/profile")
      .set("Cookie", [session_info])
      .send({ firstname: "Howard", lastname: "Rogers", dob: "1923/09/19", education: [{degree: "Bachelors", major: "Software Engineering", gradDate: "2018/05/21", institution: "RIT"}], career: [{ jobTitle: "Plumber", organization: "Happy Plumbing Inc"}]});
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Profile Updated.");
  });

  it("GET /profile - updated career profile information", async () => {
    const res = await request
      .get("/profile")
      .set("Cookie", [session_info])
    expect(res.statusCode).toEqual(200);
    let body = JSON.parse(res.text);
    expect(body.firstname).toEqual('Howard');
    expect(body.lastname).toEqual('Rogers');
    expect(body.dob).toEqual('1923-09-19T04:00:00.000Z');
    expect(body.education[0].degree).toEqual('Bachelors');
    expect(body.education[0].major).toEqual('Software Engineering');
    expect(body.education[0].gradDate).toEqual('2018-05-21T04:00:00.000Z');
    expect(body.education[0].institution.name).toEqual('RIT');
    expect(body.career[0].jobTitle).toEqual('Plumber');
    expect(body.career[0].organization.name).toEqual('Happy Plumbing Inc');
  });
});