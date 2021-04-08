const { connectDB, disconnectDB } = require("../util");
const supertest = require("supertest");
const Skill = require("../../src/models/skill");
const app = require("../../src/app");
const request = supertest(app);

var employer_session_info = "";
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
		job_posting_id = body._id;
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
});
