const mongoose = require("mongoose");
const UserModel = require("../../src/models/user");
const userData = {
	username: "test@gmail.com",
	password: "password",
};

jest.useFakeTimers();

describe("User Model Test", () => {
	beforeAll(async () => {
		await mongoose.connect(
			global.__MONGO_URI__,
			{
				useNewUrlParser: true,
				useCreateIndex: true,
				useUnifiedTopology: true,
			},
			(err) => {
				if (err) {
					console.error(err);
					process.exit(1);
				}
			}
		);
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

	it("create & save user successfully", async () => {
		const validUser = new UserModel(userData);
		const savedUser = await validUser.save();
		// Object Id should be defined when successfully saved to MongoDB.
		expect(savedUser._id).toBeDefined();
		expect(savedUser.username).toBe(userData.username);
		expect(savedUser.password).toBe(userData.password);
	});
});
