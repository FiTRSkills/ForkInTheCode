const { connectDB, disconnectDB } = require("../util");
const supertest = require("supertest");
const app = require("../../src/app");
const request = supertest(app);

describe("testing index.js routes", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  it("POST /register - no registration information", async () => {
    const res = await request.post("/register");
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("MissingUsernameError");
  });

  it("POST /register - success", async () => {
    const res = await request
      .post("/register")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({
        username: "tester@gmail.com",
        password: "chicken",
        usertype: "JobSeekerProfile",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Successfully created user");
  });

  it("POST /login - failure", async () => {
    const res = await request.post("/login");
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("Bad Request");
  });

  it("POST /login - incorrect password", async () => {
    const res = await request
      .post("/login")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({ username: "tester@gmail.com", password: "chickem" });
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual("Unauthorized");
  });

  it("POST /login - success", async () => {
    const res = await request
      .post("/login")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({ username: "tester@gmail.com", password: "chicken" });
    console.log(res.text);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("tester@gmail.com");
  });

  it("GET /logout - success", async () => {
    const res = await request.get("/logout");
    expect(res.statusCode).toEqual(200);
  });
});