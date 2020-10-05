const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = new mongoose.Schema({

});
// Adds username, hash, salt, and some methods to the schema.
User.plugin(passportLocalMongoose);

const UserModel = mongoose.model("User", User);
module.exports = UserModel;

// Configure passport to be used independently.
passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());