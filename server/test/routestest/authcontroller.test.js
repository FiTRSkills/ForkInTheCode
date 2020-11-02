const { connectDB, disconnectDB } = require("../util");
const supertest = require("supertest");
const app = require("../../src/app");
const request = supertest(app);

describe("AuthController Tests", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  it("POST /register - no registration information JobSeeker", async () => {
    const res = await request.post("/register")
      .send({
        usertype: "JobSeekerProfile",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("{\"errors\":[{\"msg\":\"Your email is not valid\",\"param\":\"email\",\"location\":\"body\"},{\"msg\":\"Your email is not valid\",\"param\":\"email\",\"location\":\"body\"},{\"msg\":\"Must send a password\",\"param\":\"password\",\"location\":\"body\"}]}");
  });

  it("POST /register - no registration information Employer", async () => {
    const res = await request.post("/register")
      .send({
        usertype: "EmployerProfile",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("{\"errors\":[{\"msg\":\"Your email is not valid\",\"param\":\"email\",\"location\":\"body\"},{\"msg\":\"Your email is not valid\",\"param\":\"email\",\"location\":\"body\"},{\"msg\":\"Must send a password\",\"param\":\"password\",\"location\":\"body\"}]}");
  });

  it("POST /register - no registration information Educator", async () => {
    const res = await request.post("/register")
      .send({
        usertype: "EducatorProfile",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("{\"errors\":[{\"msg\":\"Your email is not valid\",\"param\":\"email\",\"location\":\"body\"},{\"msg\":\"Your email is not valid\",\"param\":\"email\",\"location\":\"body\"},{\"msg\":\"Must send a password\",\"param\":\"password\",\"location\":\"body\"}]}");
  });

  it("POST /register - invalid email", async () => {
    const res = await request.post("/register")
      .send({
        email: "testEducator",
        password: "chicken",
        usertype: "JobSeekerProfile",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("{\"errors\":[{\"value\":\"testEducator\",\"msg\":\"Your email is not valid\",\"param\":\"email\",\"location\":\"body\"}]}");
  });

  it("POST /register - invalid usertype", async () => {
    const res = await request
      .post("/register")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({
        email: "testEducator@gmail.com",
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
        email: "tester@gmail.com",
        password: "chicken",
        usertype: "JobSeekerProfile",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Successfully created Job Seeker user");
  });

  it("POST /register - same email Job Seeker", async () => {
    const res = await request
      .post("/register")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({
        email: "tester@gmail.com",
        password: "chicken",
        usertype: "JobSeekerProfile",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("{\"name\":\"UserExistsError\",\"message\":\"A user with the given username is already registered\"}");
  });

  it("POST /register - Educator success", async () => {
    const res = await request
      .post("/register")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({
        email: "testEducator@gmail.com",
        password: "chicken",
        usertype: "EducatorProfile",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Successfully created Educator user");
  });

  it("POST /register - same email Educator", async () => {
    const res = await request
      .post("/register")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({
        email: "testEducator@gmail.com",
        password: "chicken",
        usertype: "EducatorProfile",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("{\"name\":\"UserExistsError\",\"message\":\"A user with the given username is already registered\"}");
  });

  it("POST /register - Employer success", async () => {
    const res = await request
      .post("/register")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({
        email: "testEmployer@gmail.com",
        password: "chicken",
        usertype: "EmployerProfile",
        organization: "WacDonalds",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Successfully created Employer user");
  });

  it("POST /register - same email Employer", async () => {
    const res = await request
      .post("/register")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({
        email: "testEmployer@gmail.com",
        password: "chicken",
        usertype: "EmployerProfile",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("{\"name\":\"UserExistsError\",\"message\":\"A user with the given username is already registered\"}");
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
      .send({ email: "tester@gmail.com", password: "chickem" });
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual("Unauthorized");
  });

  it("POST /login - success", async () => {
    const res = await request
      .post("/login")
      .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
      .send({ email: "tester@gmail.com", password: "chicken" });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual(expect.anything());
  });

  it("GET /logout - success", async () => {
    const res = await request.get("/logout");
    expect(res.statusCode).toEqual(200);
  });
});
