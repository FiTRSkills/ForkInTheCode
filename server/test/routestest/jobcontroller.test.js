const { connectDB, disconnectDB } = require("../util");
const supertest = require("supertest");
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
		const res = await request
			.post("/jobPosting")
			.set("Cookie", [employer_session_info])
			.send({
				jobTitle: "Software Engineer",
				pay: "$60,000",
				code: "1",
				zipCode: "12345",
				description: "This is a posting for a SE.",
				qualifications: "Don't suck at coding.",
				organization: "Microsoft",
				skills: ["Coding", "Communication", "C"],
			});
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("Invalid usertype to create job postings.");
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
		const res = await request
			.post("/jobPosting")
			.set("Cookie", [employer_session_info])
			.send({
				jobTitle: "Software Engineer",
				pay: "$60,000",
				code: "1",
				zipCode: "12345",
				description: "This is a posting for a SE.",
				qualifications: "Don't suck at coding.",
				organization: "Microsoft",
				skills: ["Coding", "Communication", "C"],
			});
		let body = JSON.parse(res.text);
		job_posting_id = body.id;
		expect(res.statusCode).toEqual(200);
		expect(body.organization.name).toEqual("Microsoft");
		expect(body.jobTitle).toEqual("Software Engineer");
		expect(body.pay).toEqual("$60,000");
		expect(body.code).toEqual("1");
		expect(body.zipCode).toEqual("12345");
		expect(body.description).toEqual("This is a posting for a SE.");
		expect(body.qualifications).toEqual("Don't suck at coding.");
		expect(body.skills[0].name).toEqual("Coding");
		expect(body.skills[1].name).toEqual("Communication");
		c_skill = body.skills[2];
		expect(body.skills[2].name).toEqual("C");
	});

	it("GET /jobs/jobposting - get a job posting", async () => {
		const res = await request
			.get("/jobs/jobposting")
			.query({ id: job_posting_id })
			.set("Cookie", [employer_session_info]);
		let body = JSON.parse(res.text);
		expect(res.statusCode).toEqual(200);
		expect(body.organization.name).toEqual("Microsoft");
		expect(body.jobTitle).toEqual("Software Engineer");
		expect(body.pay).toEqual("$60,000");
		expect(body.code).toEqual("1");
		expect(body.zipCode).toEqual("12345");
		expect(body.description).toEqual("This is a posting for a SE.");
		expect(body.qualifications).toEqual("Don't suck at coding.");
		expect(body.skills[0].name).toEqual("Coding");
		expect(body.skills[1].name).toEqual("Communication");
		expect(body.skills[2].name).toEqual("C");
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
		const res = await request
			.post("/JobSearch")
			.set("Cookie", [employer_session_info])
			.send({
				zipCode: "12345",
				skills: [c_skill],
			});
		expect(res.statusCode).toEqual(200);
		let body = JSON.parse(res.text);
		expect(body.length).toEqual(1);
	});

	it("POST /jobPosting - create another job posting", async () => {
		const res = await request
			.post("/jobPosting")
			.set("Cookie", [employer_session_info])
			.send({
				jobTitle: "Plumber",
				pay: "$80,000",
				code: "2",
				zipCode: "12346",
				description: "Fix piping.",
				qualifications: "2 years experience.",
				organization: "Happy Plumbers Inc",
				skills: ["Plumbing", "Communication"],
			});
		let body = JSON.parse(res.text);
		job_posting_id = body.id;
		expect(res.statusCode).toEqual(200);
		expect(body.organization.name).toEqual("Happy Plumbers Inc");
		expect(body.jobTitle).toEqual("Plumber");
		expect(body.pay).toEqual("$80,000");
		expect(body.code).toEqual("2");
		expect(body.zipCode).toEqual("12346");
		expect(body.description).toEqual("Fix piping.");
		expect(body.qualifications).toEqual("2 years experience.");
		expect(body.skills[0].name).toEqual("Plumbing");
		expect(body.skills[1].name).toEqual("Communication");
		com_skill = body.skills[1];
	});

	it("GET /jobs/jobposting - get another job posting", async () => {
		const res = await request
			.get("/jobs/jobposting")
			.query({ id: job_posting_id })
			.set("Cookie", [employer_session_info]);
		let body = JSON.parse(res.text);
		expect(res.statusCode).toEqual(200);
		expect(body.organization.name).toEqual("Happy Plumbers Inc");
		expect(body.jobTitle).toEqual("Plumber");
		expect(body.pay).toEqual("$80,000");
		expect(body.code).toEqual("2");
		expect(body.zipCode).toEqual("12346");
		expect(body.description).toEqual("Fix piping.");
		expect(body.qualifications).toEqual("2 years experience.");
		expect(body.skills[0].name).toEqual("Plumbing");
		expect(body.skills[1].name).toEqual("Communication");
	});

	it("POST /jobs/search - search for job postings 12345 zipcode", async () => {
		const res = await request
			.post("/JobSearch")
			.set("Cookie", [employer_session_info])
			.send({
				zipCode: "12345",
				skills: [com_skill],
			});
		let body = JSON.parse(res.text);
		expect(body.length).toEqual(1);
		expect(res.statusCode).toEqual(200);
	});

	it("POST /jobPosting - create another job posting", async () => {
		const res = await request
			.post("/jobPosting")
			.set("Cookie", [employer_session_info])
			.send({
				jobTitle: "Plumber",
				pay: "$80,000",
				code: "2",
				zipCode: "12345",
				description: "Fix piping.",
				qualifications: "2 years experience.",
				organization: "Happy Plumbers Inc",
				skills: ["Plumbing", "Communication"],
			});
		let body = JSON.parse(res.text);
		job_posting_id = body.id;
		expect(res.statusCode).toEqual(200);
		expect(body.organization.name).toEqual("Happy Plumbers Inc");
		expect(body.jobTitle).toEqual("Plumber");
		expect(body.pay).toEqual("$80,000");
		expect(body.code).toEqual("2");
		expect(body.zipCode).toEqual("12345");
		expect(body.description).toEqual("Fix piping.");
		expect(body.qualifications).toEqual("2 years experience.");
		expect(body.skills[0].name).toEqual("Plumbing");
		expect(body.skills[1].name).toEqual("Communication");
		com_skill = body.skills[1];
	});

	it("GET /jobs/jobposting - get another job posting", async () => {
		const res = await request
			.get("/jobs/jobposting")
			.query({ id: job_posting_id })
			.set("Cookie", [employer_session_info]);
		let body = JSON.parse(res.text);
		expect(res.statusCode).toEqual(200);
		expect(body.organization.name).toEqual("Happy Plumbers Inc");
		expect(body.jobTitle).toEqual("Plumber");
		expect(body.pay).toEqual("$80,000");
		expect(body.code).toEqual("2");
		expect(body.zipCode).toEqual("12345");
		expect(body.description).toEqual("Fix piping.");
		expect(body.qualifications).toEqual("2 years experience.");
		expect(body.skills[0].name).toEqual("Plumbing");
		expect(body.skills[1].name).toEqual("Communication");
	});

	it("POST /jobs/search - search for job postings 12345 zipcode", async () => {
		const res = await request
			.post("/JobSearch")
			.set("Cookie", [employer_session_info])
			.send({
				zipCode: "12345",
				skills: [com_skill],
			});
		let body = JSON.parse(res.text);
		expect(body.length).toEqual(2);
		expect(res.statusCode).toEqual(200);
	});
});
