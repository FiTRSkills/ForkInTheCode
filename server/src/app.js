const express = require("express");
const subdomain = require("express-subdomain");

const app = express();
const page = require("./page");
const api = require("./api");

if (process.env.NODE_ENV === "production") {
  app.use(subdomain("api", api));
  app.use(page);
} else {
  app.use(api);
}

module.exports = app;
