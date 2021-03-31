const express = require("express");
const subdomain = require("express-subdomain");

const app = express();
const page = require("./client");
const api = require("./api");

if (process.env.NODE_ENV === "production") {
  if (process.env.DOMAIN) {
    app.use(subdomain("api", api));
    app.use(page);
  } else {
    app.use("/api", api);
    app.use(page);
  }
} else {
  app.use(api);
}

module.exports = app;
