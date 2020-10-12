require("dotenv").config({
    path: ".env",
});
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const indexRouter = require("./routes/index");
const app = express();

//mongoose config
mongoose.connect(process.env.DB_CONN, {
    auth: {
        user: process.env.DB_USER,
        password: process.env.DB_PW,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false,
});

//web server config
app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../../client/build")));

app.use("/", indexRouter);

//initalizing passport and express session
app.use(
    require("express-session")({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Configure passport to be used independently.
const User = require("./models/user");
passport.use(
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
        },
        User.authenticate()
    )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
