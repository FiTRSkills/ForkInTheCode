const { connectDB, disconnectDB } = require("../util");
const supertest = require("supertest");
const app = require("../../src/app");
const request = supertest(app);

describe("testing index.js routes", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  it("GET /profile - no user session", async () => {
    const res = await request
      .get("/profile")
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("access denied");
  });
});