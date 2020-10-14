const { connectDB, disconnectDB } = require("../util");
const User = require("../../src/models/user");

const userData = {
  username: "test@gmail.com",
  password: "password",
};

describe("User Model Test", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  it("create & save user successfully", async () => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    //expect(savedUser.password).toBe(userData.password);
  });
});
