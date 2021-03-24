const express = require("express");
const path = require("path");

const app = express();
const api = require("./api");

app.use(express.static(path.join(__dirname, "../../client/build")));
app.use(api);

module.exports = app;
