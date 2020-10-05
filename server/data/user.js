const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const User = new mongoose.Schema({

});
// Adds username, hash, salt, and some methods to the schema.
User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);