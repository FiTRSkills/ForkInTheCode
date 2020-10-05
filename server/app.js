require("dotenv").config({
    path: "../.env"
});
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const testRouter = require('./routes/testapi');
const app = express();

// Web-server configurations
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/build')));

// Web-server endpoints
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/testAPI', testRouter);

// Web-server 404 handling
app.use(function(req, res, next){
    res.send("Unknown resource: " + req.path);
});
// Web-server error handling
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

module.exports = app;
