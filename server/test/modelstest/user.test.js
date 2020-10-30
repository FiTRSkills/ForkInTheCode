const { connectDB, disconnectDB } = require("../util");
const User = require("../../src/models/user");

const USER1 = {
  email: "test@gmail.com",
  password: "password",
};
const USER2 = {
  email: "test2@gmail.com",
  password: "password2",
};

describe("User Model Test", () => {
  beforeAll(connectDB);
  afterAll(disconnectDB);

  // Cleanup users after each test
  afterEach(async () => {
    await User.remove({});
  });

  it("register user", async () => {
    let user = new User({ email: USER1.email });
    user = await User.register(user, USER1.password);

    expect(user._id).toEqual(expect.anything());
    expect(user.email).toEqual(USER1.email);
    expect(user.password).toBeUndefined();
    expect(user.hash).toEqual(expect.anything());
    expect(user.salt).toEqual(expect.anything());
    await expect(user.getProfile()).resolves.toEqual(expect.anything());
  });

  it("register user - used email", async () => {
    let user1 = new User({ email: USER1.email });
    let user2 = new User({ email: USER1.email });
    await expect(User.register(user1, USER1.password)).resolves.toEqual(
      expect.anything()
    );
    await expect(User.register(user2, USER1.password)).rejects.toThrow();
  });

  it("authenticate user - no user", async () => {
    const authenticate = User.authenticate();
    let auth = await authenticate(USER1.email, USER1.password);

    expect(auth.user).toBeFalsy();
    expect(auth.error).toEqual(expect.anything());
  });

  it("authenticate user - success", async () => {
    let user1 = new User({ email: USER1.email });
    let user = await User.register(user1, USER1.password);
    let auth = await user.authenticate(USER1.password);

    expect(auth.user).toBe(user1);
    expect(auth.error).toBeUndefined();
  });

  it("authenticate user - static method", async () => {
    let user1 = new User({ email: USER1.email });
    await expect(User.register(user1, USER1.password)).resolves.toEqual(
      expect.anything()
    );

    const authenticate = User.authenticate();

    let auth = await authenticate(USER1.email, USER1.password);
    expect(auth.user.email).toEqual(user1.email);
    expect(auth.user.hash).toEqual(user1.hash);
    expect(auth.error).toBeUndefined();
  });

  it("authenticate user - incorrect email", async () => {
    let user1 = new User({ email: USER1.email });
    await expect(User.register(user1, USER1.password)).resolves.toEqual(
      expect.anything()
    );

    const authenticate = User.authenticate();

    let auth = await authenticate(USER2.email, USER1.password);
    expect(auth.user).toBeFalsy();
    expect(auth.error).toEqual(expect.anything());
  });

  it("authenticate user - incorrect password", async () => {
    let user1 = new User({ email: USER1.email });
    let user = await User.register(user1, USER1.password);

    let auth = await user.authenticate(USER2.password);
    expect(auth.user).toBeFalsy();
    expect(auth.error).toEqual(expect.anything());
  });
});
