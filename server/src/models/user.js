const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

/**
 * Types of users that can be present on the system.
 */
const USER_TYPES = {
	JOB_SEEKER: require("./jobseekerProfile").modelName,
	EMPLOYER: require("./employerProfile").modelName,
	EDUCATOR: require("./educatorProfile").modelName
}

/**
 * User model that is used for any account of any type on the system. Links to a profile
 * that contains specific information about that user.  Different user types will link to
 * different profiles.
 *
 * @type {Schema}
 */
const User = new mongoose.Schema({
	//email, hash, salt, etc. defined by passportLocalMongoose
	created: {
		type: Date,
		default: Date.now
	},
	type: {
		type: String,
		enum: Object.values(USER_TYPES),
		default: USER_TYPES.JOB_SEEKER
	},
	profile: {
		type: mongoose.Schema.Types.ObjectId,
		refPath: "type"
	}
});
// Adds username, hash, salt, (also defined above for clarity) and some methods to the schema.
User.plugin(passportLocalMongoose);

// Generate a new profile before saving the user to the database
User.pre("save", function(next){
	let profile = mongoose.model(this.type)();
	this.profile = profile.id;
	profile.save();
	next();
});

/**
 * Gets the profile associated with this account from the server.
 *
 * @param cb An optional callback to use instead of a promise
 * @returns {Promise} resolves when the profile is retrieved from the database
 */
User.methods.getProfile = function(cb){
	const Profile = mongoose.model(this.type);
	const promise = Profile.findById(this.profile);
	if(!cb) return promise;
	promise.then((profile) => cb(profile));
}

// Expose user types to avoid magic strings
User.statics.Type = USER_TYPES;

const UserModel = mongoose.model("User", User);
module.exports = UserModel;

// Configure passport to use with our database
passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());


