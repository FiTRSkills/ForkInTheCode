const { connectDB, disconnectDB } = require("../util");
const supertest = require("supertest");
const Skill = require("../../src/models/skill");
const Course = require("../../src/models/course");
const app = require("../../src/app");
const request = supertest(app);

let session_info = "";
let course_id = "";

describe("CourseController Tests", () => {
	beforeAll(connectDB);
	afterAll(disconnectDB);

	it("GET /courses - not logged in", async () => {
		const res = await request.get("/courses");
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Access Denied.");
	});

	it("POST /courses/course - not logged in", async () => {
		const res = await request.post("/courses/course");
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Access Denied.");
	});

	it("PATCH /courses/course - not logged in", async () => {
		const res = await request.patch("/courses/course");
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Access Denied.");
	});

	it("DELETE /courses/course - not logged in", async () => {
		const res = await request.delete("/courses/course");
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Access Denied.");
	});

	it("POST /register - Job Seeker success", async () => {
		const res = await request
			.post("/register")
			.set(
				"Content-Type",
				"application/x-www-form-urlencoded; charset=UTF-8"
			)
			.send({
				email: "tester@gmail.com",
				password: "chicken",
				usertype: "JobSeekerProfile",
			});
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual("Successfully created Job Seeker user");
	});

	it("POST /login - success", async () => {
		const res = await request
			.post("/login")
			.set(
				"Content-Type",
				"application/x-www-form-urlencoded; charset=UTF-8"
			)
			.send({ email: "tester@gmail.com", password: "chicken" });
		session_info = res.header["set-cookie"];
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual(expect.anything());
	});

	it("GET /courses - wrong usertype", async () => {
		const res = await request.get("/courses").set("Cookie", [session_info]);
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Invalid usertype.");
	});

	it("POST /courses/course - wrong usertype", async () => {
		const res = await request
			.post("/courses/course")
			.set("Cookie", [session_info])
			.send({ location: "1", name: "Name", skills: "skills" });
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Invalid usertype.");
	});

	it("PATCH /courses/course - wrong usertype", async () => {
		const res = await request
			.patch("/courses/course")
			.set("Cookie", [session_info])
			.send({
				location: "1",
				name: "Name",
				skills: ["123", "567"],
				_id: "1123",
				contact: "",
				period: "",
				times: "",
				description: "",
				moneyCost: "",
				timeCost: "",
				requiredEquipment: "",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Invalid usertype.");
	});

	it("DELETE /courses/course - wrong usertype", async () => {
		const res = await request
			.delete("/courses/course")
			.set("Cookie", [session_info])
			.send({ _id: "123" });
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Invalid usertype.");
	});

	it("PATCH /courses/course - doesn't have optional data", async () => {
		const res = await request
			.patch("/courses/course")
			.set("Cookie", [session_info])
			.send({
				location: "1",
				name: "Name",
				skills: ["123", "567"],
				_id: "Ree",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual(
			'{"errors":[{"msg":"Contact must exist","param":"contact","location":"body"},{"msg":"Period must exist","param":"period","location":"body"},{"msg":"Times must exist","param":"times","location":"body"},{"msg":"Description must exist","param":"description","location":"body"},{"msg":"moneyCost must exist","param":"moneyCost","location":"body"},{"msg":"timeCost must exist","param":"timeCost","location":"body"},{"msg":"requiredEquipment must exist","param":"requiredEquipment","location":"body"}]}'
		);
	});

	it("GET /logout - success", async () => {
		const res = await request.get("/logout");
		expect(res.statusCode).toEqual(200);
	});

	it("POST /register - Educator success", async () => {
		const res = await request
			.post("/register")
			.set(
				"Content-Type",
				"application/x-www-form-urlencoded; charset=UTF-8"
			)
			.send({
				email: "tester789@gmail.com",
				password: "chicken45",
				organization: "RIT",
				usertype: "EducatorProfile",
			});
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual("Successfully created Educator user");
	});

	it("POST /login - success", async () => {
		const res = await request
			.post("/login")
			.set(
				"Content-Type",
				"application/x-www-form-urlencoded; charset=UTF-8"
			)
			.send({ email: "tester789@gmail.com", password: "chicken45" });
		session_info = res.header["set-cookie"];
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual(expect.anything());
	});

	it("POST /courses/course - missing argument", async () => {
		const res = await request
			.post("/courses/course")
			.set("Cookie", [session_info])
			.send({ location: "1", name: "Name" });
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual(
			'{"errors":[{"msg":"Must send a viable list of skills","param":"skills","location":"body"}]}'
		);
	});

	it("POST /courses/course - skills is invalid", async () => {
		const res = await request
			.post("/courses/course")
			.set("Cookie", [session_info])
			.send({
				location: "1",
				name: "Name",
				skills: ["skills"],
				description: "This is a course",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Error adding skills.");
	});

	it("POST /courses/course - success", async () => {
		let skill = await Skill.findOneOrCreate("Coding");
		const res = await request
			.post("/courses/course")
			.set("Cookie", [session_info])
			.send({
				location: "1313 Dead End Drive",
				name: "How to Get Away with Murder",
				skills: [skill._id],
				description: "This is a course",
			});
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual("Successfully created course.");
	});

	it("GET /courses - success", async () => {
		const res = await request.get("/courses").set("Cookie", [session_info]);
		expect(res.statusCode).toEqual(200);
		let body = JSON.parse(res.text);
		expect(body[0].name).toEqual("How to Get Away with Murder");
		course_id = body[0]._id;
		expect(body.length).toEqual(1);
	});

	it("PATCH /courses/course - success", async () => {
		let skill = await Skill.findOneOrCreate("Coding");
		const res = await request
			.patch("/courses/course")
			.set("Cookie", [session_info])
			.send({
				_id: course_id,
				location: "1313 Dead End Drive",
				name: "How to Get Away with Murder 2",
				skills: [skill._id],
				description: "This is a course",
				times: "12-13",
				period: "Monday",
				contact: "215-234-5678",
				moneyCost: "$4200",
				timeCost: "4 hours a week",
				requiredEquipment: "Mask",
			});
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual("Successfully updated course.");
	});

	it("GET /courses - success changed course information", async () => {
		const res = await request.get("/courses").set("Cookie", [session_info]);
		expect(res.statusCode).toEqual(200);
		let body = JSON.parse(res.text);
		expect(body[0].name).toEqual("How to Get Away with Murder 2");
		expect(body[0].times).toEqual("12-13");
		expect(body.length).toEqual(1);
	});

	it("DELETE /courses/course - success", async () => {
		const res = await request
			.delete("/courses/course")
			.set("Cookie", [session_info])
			.send({ _id: course_id });
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual("Successfully deleted course.");
	});

	it("GET /courses - no courses", async () => {
		const res = await request.get("/courses").set("Cookie", [session_info]);
		expect(res.statusCode).toEqual(200);
		let body = JSON.parse(res.text);
		expect(body.length).toEqual(0);
	});

	it("DELETE /courses/course - error deleting", async () => {
		const res = await request
			.delete("/courses/course")
			.set("Cookie", [session_info])
			.send({ _id: "12312412" });
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Error deleting course.");
	});

	it("PATCH /courses/course - error editing", async () => {
		let skill = await Skill.findOneOrCreate("Coding");
		const res = await request
			.patch("/courses/course")
			.set("Cookie", [session_info])
			.send({
				_id: "12312412",
				location: "1313 Dead End Drive",
				name: "How to Get Away with Murder 2",
				skills: [skill._id],
				description: "This is a course",
				times: "12-13",
				period: "Monday",
				contact: "215-234-5678",
				moneyCost: "$4200",
				timeCost: "4 hours a week",
				requiredEquipment: "Mask",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Error editing course.");
	});

	it("POST /courses/course - error adding skills", async () => {
		let skill = await Skill.findOneOrCreate("Coding");
		const res = await request
			.post("/courses/course")
			.set("Cookie", [session_info])
			.send({
				location: "1313 Dead End Drive",
				name: "How to Get Away with Murder",
				skills: ["12312412"],
				description: "This is a course",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Error adding skills.");
	});
});
