const express = require("express");
const path = require("path");

const page = express.Router();
const files = path.join(__dirname, "../../client/build");

// Serve up any static resources first and foremost
page.use(express.static(files));

// Catch all requests that have not been handled and serve up the single page app
page.use(function (req, res, next) {
  res.sendFile(path.join(files, "index.html"));
});

module.exports = page;
