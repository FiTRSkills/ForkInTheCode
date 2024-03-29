const { connectDB, disconnectDB } = require("../util");
const supertest = require("supertest");
const Skill = require("../../src/models/skill");
const app = require("../../src/app");
const request = supertest(app);

var employer_session_info = "";
var saved_posting_id = "";
var job_posting_id = "";
var c_skill = "";
var com_skill = "";

describe("JobController Tests", () => {
	beforeAll(connectDB);
	afterAll(disconnectDB);

	it("GET /profile - educator user session", async () => {
		const registerres = await request
			.post("/register")
			.set(
				"Content-Type",
				"application/x-www-form-urlencoded; charset=UTF-8"
			)
			.send({
				email: "testedprofile@gmail.com",
				password: "chicken",
				usertype: "EducatorProfile",
			});
		const loginres = await request
			.post("/login")
			.set(
				"Content-Type",
				"application/x-www-form-urlencoded; charset=UTF-8"
			)
			.send({ email: "testedprofile@gmail.com", password: "chicken" });
		employer_session_info = loginres.header["set-cookie"];
	});

	it("PATCH /jobPosting - invalid usertype", async () => {
		let skill = await Skill.findOneOrCreate("Coding");
		const res = await request
			.patch("/jobPosting")
			.set("Cookie", [employer_session_info])
			.send({
				_id: "13412412424",
				jobTitle: "Plumber Two",
				salary: "$75,000",
				amountOfJobs: "1",
				location: "Online",
				jobTimeline: "",
				benefits: "",
				courses: [],
				zipCode: "12345",
				description: "Fix piping.",
				responsibilities: "2 years experience.",
				skills: [skill],
			});
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Invalid usertype.");
	});

	it("DELETE /jobPosting - invalid usertype", async () => {
		const res = await request
			.delete("/jobPosting")
			.set("Cookie", [employer_session_info])
			.send({ _id: "12312412412" });
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Invalid usertype.");
	});

	it("POST /jobPosting - create a job posting as not an employer", async () => {
		let skill = await Skill.findOneOrCreate("Coding");
		let skill2 = await Skill.findOneOrCreate("Communication");
		let skill3 = await Skill.findOneOrCreate("C");
		const res = await request
			.post("/jobPosting")
			.set("Cookie", [employer_session_info])
			.send({
				jobTitle: "Software Engineer",
				salary: "$60,000",
				location: "Online",
				benefits: "Healthcare",
				amountOfJobs: "2",
				zipCode: "12345",
				description: "This is a posting for a SE.",
				responsibilities: "Don't suck at coding.",
				jobTimeline: "6 months",
				skills: [skill, skill2, skill3],
			});
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Invalid usertype.");
		const logoutres = await request.get("/logout");
		expect(logoutres.statusCode).toEqual(200);
		expect(logoutres.text).toEqual("Successfully logged out");
	});

	it("GET /profile - employer user session", async () => {
		const registerres = await request
			.post("/register")
			.set(
				"Content-Type",
				"application/x-www-form-urlencoded; charset=UTF-8"
			)
			.send({
				email: "testemprofile@gmail.com",
				password: "chicken",
				usertype: "EmployerProfile",
				organization: "Microsoft",
			});
		const loginres = await request
			.post("/login")
			.set(
				"Content-Type",
				"application/x-www-form-urlencoded; charset=UTF-8"
			)
			.send({ email: "testemprofile@gmail.com", password: "chicken" });
		employer_session_info = loginres.header["set-cookie"];
	});

	it("POST /jobs/search - search for job postings with no results", async () => {
		const res = await request
			.post("/JobSearch")
			.set("Cookie", [employer_session_info])
			.send({
				zipCode: "12345",
				skills: [],
			});
		expect(res.statusCode).toEqual(200);
		let body = JSON.parse(res.text);
		expect(body.length).toEqual(0);
	});

	it("POST /jobPosting - create a job posting", async () => {
		let skill123 = await Skill.findOneOrCreate("Coding");
		let skill234 = await Skill.findOneOrCreate("Communication");
		let skill345 = await Skill.findOneOrCreate("C");
		const res = await request
			.post("/jobPosting")
			.set("Cookie", [employer_session_info])
			.send({
				jobTitle: "Software Engineer",
				salary: "$60,000",
				benefits: "Healthcare",
				location: "Online",
				amountOfJobs: "2",
				zipCode: "12345",
				description: "This is a posting for a SE.",
				responsibilities: "Don't suck at coding.",
				jobTimeline: "6 months",
				skills: [skill123, skill234, skill345],
			});
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual("Successfully created jobposting.");
	});

	it("GET /jobs/jobposting - get a job posting that doesn't exist", async () => {
		const res = await request
			.get("/jobs/jobposting")
			.query({ id: "123324872384" })
			.set("Cookie", [employer_session_info]);
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual(
			"Job post with id 123324872384 does not exist."
		);
	});

	it("POST /jobs/search - search for job postings", async () => {
		let skillc = await Skill.findOneOrCreate("C");
		const res = await request
			.post("/JobSearch")
			.set("Cookie", [employer_session_info])
			.send({
				zipCode: "12345",
				skills: [skillc],
			});
		expect(res.statusCode).toEqual(200);
		let body = JSON.parse(res.text);
		job_posting_id = body[0]._id;
		saved_posting_id = body[0]._id;
		expect(body.length).toEqual(1);
	});

	it("POST /jobPosting - create another job posting", async () => {
		let skill9 = await Skill.findOneOrCreate("Plumbing");
		let skill0 = await Skill.findOneOrCreate("Communication");
		const res = await request
			.post("/jobPosting")
			.set("Cookie", [employer_session_info])
			.send({
				jobTitle: "Plumber",
				salary: "$80,000",
				location: "Online",
				zipCode: "12346",
				description: "Fix piping.",
				responsibilities: "2 years experience.",
				skills: [skill9, skill0],
			});
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual("Successfully created jobposting.");
	});

	it("POST /jobs/search - search for job postings 12346 zipcode", async () => {
		let skill92 = await Skill.findOneOrCreate("Plumbing");
		const res = await request
			.post("/JobSearch")
			.set("Cookie", [employer_session_info])
			.send({
				zipCode: "12346",
				skills: [skill92],
			});
		let body = JSON.parse(res.text);
		expect(body.length).toEqual(1);
		job_posting_id = body[0]._id;
		expect(res.statusCode).toEqual(200);
	});

	it("GET /jobs/jobposting - get another job posting", async () => {
		const res = await request
			.get("/jobs/jobposting")
			.query({ id: job_posting_id })
			.set("Cookie", [employer_session_info]);
		let body = JSON.parse(res.text);
		expect(res.statusCode).toEqual(200);
		expect(body.organization.name).toEqual("Microsoft");
		expect(body.jobTitle).toEqual("Plumber");
		expect(body.salary).toEqual("$80,000");
		expect(body.zipCode).toEqual("12346");
		expect(body.description).toEqual("Fix piping.");
		expect(body.responsibilities).toEqual("2 years experience.");
		expect(body.skills[0].name).toEqual("Plumbing");
		expect(body.skills[1].name).toEqual("Communication");
	});

	it("POST /jobPosting - create another job posting", async () => {
		let skill6 = await Skill.findOneOrCreate("Plumbing");
		let skill7 = await Skill.findOneOrCreate("Communication");
		const res = await request
			.post("/jobPosting")
			.set("Cookie", [employer_session_info])
			.send({
				jobTitle: "Plumber",
				salary: "$80,000",
				location: "Online",
				amountOfJobs: "2",
				zipCode: "12345",
				description: "Fix piping.",
				responsibilities: "2 years experience.",
				skills: [skill6, skill7],
			});
		expect(res.text).toEqual("Successfully created jobposting.");
		expect(res.statusCode).toEqual(200);
	});

	it("POST /jobs/search - search for job postings 12346 zipcode", async () => {
		let skill92 = await Skill.findOneOrCreate("Plumbing");
		const res = await request
			.post("/JobSearch")
			.set("Cookie", [employer_session_info])
			.send({
				zipCode: "12345",
				skills: [skill92],
			});
		let body = JSON.parse(res.text);
		expect(body.length).toEqual(1);
		job_posting_id = body[0]._id;
		expect(res.statusCode).toEqual(200);
	});

	it("GET /jobs/jobposting - get another job posting", async () => {
		const res = await request
			.get("/jobs/jobposting")
			.query({ id: job_posting_id })
			.set("Cookie", [employer_session_info]);
		let body = JSON.parse(res.text);
		expect(res.statusCode).toEqual(200);
		expect(body.organization.name).toEqual("Microsoft");
		expect(body.jobTitle).toEqual("Plumber");
		expect(body.salary).toEqual("$80,000");
		expect(body.zipCode).toEqual("12345");
		expect(body.description).toEqual("Fix piping.");
		expect(body.responsibilities).toEqual("2 years experience.");
		expect(body.skills[0].name).toEqual("Plumbing");
		expect(body.skills[1].name).toEqual("Communication");
	});

	it("POST /jobs/search - search for job postings 12345 zipcode", async () => {
		const res = await request
			.post("/JobSearch")
			.set("Cookie", [employer_session_info])
			.send({
				zipCode: "12345",
			});
		let body = JSON.parse(res.text);
		expect(body.length).toEqual(2);
		expect(res.statusCode).toEqual(200);
	});

	it("GET /jobpostings - get all the user's job postings", async () => {
		const res = await request
			.get("/jobpostings")
			.set("Cookie", [employer_session_info]);
		let body = JSON.parse(res.text);
		expect(body.length).toEqual(3);
		expect(res.statusCode).toEqual(200);
	});

	it("GET /jobPosting - get a specific job posting", async () => {
		const res = await request
			.get("/jobPosting?_id=" + job_posting_id)
			.set("Cookie", [employer_session_info]);
		expect(res.statusCode).toEqual(200);
		let body = JSON.parse(res.text);
		expect(body.organization.name).toEqual("Microsoft");
		expect(body.jobTitle).toEqual("Plumber");
		expect(body.salary).toEqual("$80,000");
		expect(body.zipCode).toEqual("12345");
		expect(body.description).toEqual("Fix piping.");
		expect(body.responsibilities).toEqual("2 years experience.");
		expect(body.skills[0].name).toEqual("Plumbing");
		expect(body.skills[1].name).toEqual("Communication");
	});

	it("PATCH /jobPosting - success", async () => {
		let skill = await Skill.findOneOrCreate("Coding");
		const res = await request
			.patch("/jobPosting")
			.set("Cookie", [employer_session_info])
			.send({
				_id: job_posting_id,
				jobTitle: "Plumber Two",
				salary: "$75,000",
				amountOfJobs: "1",
				location: "Online",
				jobTimeline: "",
				benefits: "",
				courses: [],
				zipCode: "12345",
				description: "Fix piping.",
				responsibilities: "2 years experience.",
				skills: [skill],
			});
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual("Successfully updated jobposting.");
	});

	it("GET /jobPosting - get a specific job posting 2", async () => {
		const res = await request
			.get("/jobPosting?_id=" + job_posting_id)
			.set("Cookie", [employer_session_info]);
		expect(res.statusCode).toEqual(200);
		let body = JSON.parse(res.text);
		expect(body.organization.name).toEqual("Microsoft");
		expect(body.jobTitle).toEqual("Plumber Two");
		expect(body.salary).toEqual("$75,000");
		expect(body.zipCode).toEqual("12345");
		expect(body.description).toEqual("Fix piping.");
		expect(body.responsibilities).toEqual("2 years experience.");
		expect(body.skills[0].name).toEqual("Coding");
		expect(body.skills.length).toEqual(1);
	});

	it("DELETE /jobPosting - success", async () => {
		const res = await request
			.delete("/jobPosting")
			.set("Cookie", [employer_session_info])
			.send({ _id: job_posting_id });
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual("Successfully deleted jobposting.");
	});

	it("DELETE /jobPosting - job posting DNE", async () => {
		const res = await request
			.delete("/jobPosting")
			.set("Cookie", [employer_session_info])
			.send({ _id: "12312412412412" });
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Error deleting jobposting.");
	});

	it("GET /jobPosting - get a specific job posting 2", async () => {
		const res = await request
			.get("/jobPosting?_id=" + job_posting_id)
			.set("Cookie", [employer_session_info]);
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Issue retrieving jobposting.");
	});

	it("GET /profile - employer user session", async () => {
		const logoutres = await request.get("/logout");
		expect(logoutres.statusCode).toEqual(200);
		expect(logoutres.text).toEqual("Successfully logged out");
		const registerres = await request
			.post("/register")
			.set(
				"Content-Type",
				"application/x-www-form-urlencoded; charset=UTF-8"
			)
			.send({
				email: "test321emprofile@gmail.com",
				password: "chicken",
				usertype: "EmployerProfile",
				organization: "Alibaba",
			});
		const loginres = await request
			.post("/login")
			.set(
				"Content-Type",
				"application/x-www-form-urlencoded; charset=UTF-8"
			)
			.send({ email: "test321emprofile@gmail.com", password: "chicken" });
		employer_session_info = loginres.header["set-cookie"];
	});

	it("GET /jobPosting - wrong organization", async () => {
		const res = await request
			.get("/jobPosting?_id=" + saved_posting_id)
			.set("Cookie", [employer_session_info]);
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("User does not own this jobposting.");
	});

	it("PATCH /jobPosting - wrong organization", async () => {
		let skill = await Skill.findOneOrCreate("Coding");
		const res = await request
			.patch("/jobPosting")
			.set("Cookie", [employer_session_info])
			.send({
				_id: saved_posting_id,
				jobTitle: "Plumber Two",
				salary: "$75,000",
				amountOfJobs: "1",
				location: "Online",
				jobTimeline: "",
				benefits: "",
				courses: [],
				zipCode: "12345",
				description: "Fix piping.",
				responsibilities: "2 years experience.",
				skills: [skill],
			});
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("User does not own this jobposting.");
	});

	it("DELETE /jobPosting - wrong organization", async () => {
		const res = await request
			.delete("/jobPosting")
			.set("Cookie", [employer_session_info])
			.send({ _id: saved_posting_id });
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("User does not own this jobposting.");
	});
});
