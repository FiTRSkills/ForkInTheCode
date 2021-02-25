const { connectDB, disconnectDB } = require("../util");
const supertest = require("supertest");
const app = require("../../src/app");
const Skill = require("../../src/models/skill");
const request = supertest(app);

describe("testing skill routes", () => {
	beforeAll(connectDB);
	afterAll(disconnectDB);

	it("GET /skills - gets all skills when there are none", async () => {
		const res = await request.get("/skills");
		expect(res.statusCode).toEqual(406);
		expect(res.text).toEqual("no skills exist");
	});

	it("GET /skills - gets all skills", async () => {
		await Skill.findOneOrCreate("Coding");
		const res = await request.get("/skills");
		expect(res.statusCode).toEqual(200);
		let body = JSON.parse(res.text);
		expect(body[0].name).toEqual("Coding");
	});

	it("GET /skills - gets all skills multiple", async () => {
		await Skill.findOneOrCreate("Engineering");
		const res = await request.get("/skills");
		expect(res.statusCode).toEqual(200);
		let body = JSON.parse(res.text);
		expect(body[0].name).toEqual("Coding");
		expect(body[1].name).toEqual("Engineering");
	});

	it("GET /skills/getSkill - no id sent", async () => {
		const res = await request.get("/skills/getSkill");
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual(
			'{"errors":[{"msg":"Must send a viable skill id","param":"id","location":"body"}]}'
		);
	});

	it("GET /skills/getSkill - get skill that doesnt exist", async () => {
		const res = await request.get("/skills/getSkill?id=12348");
		expect(res.statusCode).toEqual(406);
		expect(res.text).toEqual("skill does not exist");
	});

	it("GET /skills/getSkill - get skill", async () => {
		let skill = await Skill.findOneOrCreate("Coding");
		const res = await request.get("/skills/getSkill?id=" + skill._id);
		expect(res.statusCode).toEqual(200);
		let body = JSON.parse(res.text);
		expect(body.name).toEqual("Coding");
	});
});
