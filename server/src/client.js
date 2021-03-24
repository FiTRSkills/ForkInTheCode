const express = require("express");
const path = require("path");

const client = express.Router();
const files = path.join(__dirname, "../../client/build");

// Serve up any static resources first and foremost
client.use(express.static(files));

// Catch all requests that have not been handled and serve up the single page app
client.use(function (req, res, next) {
  res.sendFile(path.join(files, "index.html"));
});

module.exports = client;
