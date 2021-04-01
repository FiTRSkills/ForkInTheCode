const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");

const api = express.Router();

//global mongoose configurations
const mongoose = require("mongoose");
mongoose.plugin(require("mongoose-autopopulate"));

//initalizing passport and express session
api.use(
  require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
//further passport configuration can be found in models/user.js
api.use(passport.initialize());
api.use(passport.session());

//web server config
api.use(logger("dev"));
api.use(express.json());
api.use(
  cors({
    credentials: true,
    origin: new RegExp(`https?:\\/\\/(api.)?${process.env.DOMAIN || "localhost"}(:\\d+)?`),
  })
);
api.use(express.urlencoded({ extended: false }));
api.use(cookieParser());

const indexRouter = require("./routes/index");
api.use("/", indexRouter);
api.get("/", (req, res) => res.status(200).json("success"));

// 404 - Not Found Fallback
api.use(function (req, res, next) {
  res.send("Unknown resource: " + req.path);
});
// Uncaught Error Fallback
api.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = api;
