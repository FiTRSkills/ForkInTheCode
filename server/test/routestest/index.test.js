const { connectDB, disconnectDB } = require("../util");
const supertest = require("supertest");
const app = require("../../src/app");
const request = supertest(app);

describe("testing index.js routes", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  it("POST /register - no registration information JobSeeker", async () => {
    const res = await request.post("/register")
      .send({
        usertype: "JobSeekerProfile",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.name).toEqual("MissingUsernameError");
  });

  it("POST /register - no registration information Employer", async () => {
    const res = await request.post("/register")
      .send({
        usertype: "EmployerProfile",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.name).toEqual("MissingUsernameError");
  });

  it("POST /register - no registration information Educator", async () => {
    const res = await request.post("/register")
      .send({
        usertype: "EducatorProfile",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.name).toEqual("MissingUsernameError");
  });

  it("POST /register - invalid usertype", async () => {
    const res = await request
      .post("/register")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({
        username: "testEducator@gmail.com",
        password: "chicken",
        usertype: "adminProfile",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("Invalid usertype");
  });

  it("POST /register - Job Seeker success", async () => {
    const res = await request
      .post("/register")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({
        username: "tester@gmail.com",
        password: "chicken",
        usertype: "JobSeekerProfile",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Successfully created Job Seeker user");
  });

  it("POST /register - Educator success", async () => {
    const res = await request
      .post("/register")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({
        username: "testEducator@gmail.com",
        password: "chicken",
        usertype: "EducatorProfile",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Successfully created Educator user");
  });

  it("POST /register - Employer success", async () => {
    const res = await request
      .post("/register")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({
        username: "testEmployer@gmail.com",
        password: "chicken",
        usertype: "EmployerProfile",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Successfully created Employer user");
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
