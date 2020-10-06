const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = new mongoose.Schema({
  username: String,
  password: String
});
// Adds username, hash, salt, and some methods to the schema.
User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);;
