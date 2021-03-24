const express = require("express");
const subdomain = require("express-subdomain");
const path = require("path");

const app = express();
const api = require("./api");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/build")));
  console.log("PROD");
  app.use(subdomain("api", api));
} else {
  console.log("DEV");
  app.use(api);
}

module.exports = app;
