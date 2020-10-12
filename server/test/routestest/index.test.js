const express = require("express"); // import express
const serverRoutes = require("../../src/routes/index"); //import file we are testing
const request = require("supertest"); // supertest is a framework that allows to easily test web apis
const app = express(); //an instance of an express app, a 'fake' express app
app.use("/", serverRoutes); //routes

describe("testing POST /register", () => {
	it("POST /register - failure", async () => {
		const res = await request(app).post("/register");
		expect(res.statusCode).toEqual(500);
	});
});

describe("testing POST /login", () => {
	it("POST /login - failure", async () => {
		const res = await request(app).post("/login");
		expect(res.statusCode).toEqual(500);
	});
});

describe("testing GET /logout", () => {
	it("GET /logout - success", async () => {
		const res = await request(app).get("/logout");
		expect(res.statusCode).toEqual(200);
	});
});
