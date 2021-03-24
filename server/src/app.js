const express = require("express");
const subdomain = require("express-subdomain");

const app = express();
const page = require("./page");
const api = require("./api");

if (process.env.NODE_ENV === "production") {
  app.use(page);
  app.use(subdomain("api", api));
} else {
  app.use(api);
}

module.exports = app;
