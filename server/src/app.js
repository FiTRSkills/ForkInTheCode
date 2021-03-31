const createError = require("http-errors");
const express = require("express");
const path = require("path");

const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
const app = express();

//global mongoose configurations
const mongoose = require("mongoose");
mongoose.plugin(require("mongoose-autopopulate"));

//initalizing passport and express session

app.use(
	require("express-session")({
		secret: "secret",
		resave: false,
		saveUninitialized: false,
	})
);
//further passport configuration can be found in models/user.js
app.use(passport.initialize());
app.use(passport.session());

//web server config
app.use(logger("dev"));
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../../client/build")));

const indexRouter = require("./routes/index");
app.use("/", indexRouter);
app.get("/", (req, res) => res.status(200).json("success"));

// Web-server 404 handling
app.use(function (req, res, next) {
	res.send("Unknown resource: " + req.path);
});
// Web-server error handling
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.send(err.message);
});

module.exports = app;
