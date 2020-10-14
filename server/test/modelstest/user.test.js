const { connectDB, disconnectDB } = require("../util");
const User = require("../../src/models/user");

const USER1 = {
  username: "test@gmail.com",
  password: "password",
};
const USER2 = {
  username: "test2@gmail.com",
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
    let user = new User({ username: USER1.username });
    return User.register(user, USER1.password).then(async (user) => {
      expect(user._id).toEqual(expect.anything());
      expect(user.username).toEqual(USER1.username);
      expect(user.password).toBeUndefined();
      expect(user.hash).toEqual(expect.anything());
      expect(user.salt).toEqual(expect.anything());
      await expect(user.getProfile()).resolves.toEqual(expect.anything());
    });
  });

  it("register user - used username", async () => {
    let user1 = new User({ username: USER1.username });
    let user2 = new User({ username: USER1.username });
    await expect(User.register(user1, USER1.password)).resolves.toEqual(
      expect.anything()
    );
    await expect(User.register(user2, USER1.password)).rejects.toThrow();
  });

  it("authenticate user - no user", async () => {
    const authenticate = User.authenticate();

    return authenticate(USER1.username, USER1.password).then((auth) => {
      expect(auth.user).toBeFalsy();
      expect(auth.error).toEqual(expect.anything());
    });
  });

  it("authenticate user - success", async () => {
    let user1 = new User({ username: USER1.username });
    return User.register(user1, USER1.password).then((user) => {
      return user.authenticate(USER1.password).then((auth) => {
        expect(auth.user).toBe(user1);
        expect(auth.error).toBeUndefined();
      });
    });
  });

  it("authenticate user - static method", async () => {
    let user1 = new User({ username: USER1.username });
    await expect(User.register(user1, USER1.password)).resolves.toEqual(
      expect.anything()
    );

    const authenticate = User.authenticate();

    return authenticate(USER1.username, USER1.password).then((auth) => {
      expect(auth.user.username).toEqual(user1.username);
      expect(auth.user.hash).toEqual(user1.hash);
      expect(auth.error).toBeUndefined();
    });
  });

  it("authenticate user - incorrect username", async () => {
    let user1 = new User({ username: USER1.username });
    await expect(User.register(user1, USER1.password)).resolves.toEqual(
      expect.anything()
    );

    const authenticate = User.authenticate();

    return authenticate(USER2.username, USER1.password).then((auth) => {
      expect(auth.user).toBeFalsy();
      expect(auth.error).toEqual(expect.anything());
    });
  });

  it("authenticate user - incorrect password", async () => {
    let user1 = new User({ username: USER1.username });
    return User.register(user1, USER1.password).then((user) => {
      return user.authenticate(USER2.password).then((auth) => {
        expect(auth.user).toBeFalsy();
        expect(auth.error).toEqual(expect.anything());
      });
    });
  });
});
