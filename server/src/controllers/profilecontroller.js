/** Module providing user implementation for routes
 * @module controllers/profilecontroller
 */

const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../models/user");

const profileController = {};

/**
 * functionality for getting the profile
 * @name getProfile
 * @function
 * @alias module:/controllers/profilecontroller
 * @property {request} request - contains user
 * @returns {string} response - the user profile or error if not found
 */
profileController.getProfile = async function (req, res) {
	let profile = await req.user.getProfile();
  console.log(profile);
	data = {
		firstname: profile.name.first,
		lastname: profile.name.last,
		dob: profile.dateOfBirth,
		education: profile.education,
		career: profile.career,
	}
	res.status(200).send(data);
};

/**
 * functionality for setting the profile
 * @name getProfile
 * @function
 * @alias module:/controllers/profilecontroller
 * @property {request} request - contains user
 * @returns {string} response - the user profile or error if not found
 */
profileController.postProfile = function (req, res) {
  User.find({email: req.user.email}).then(function(user){
  	if(!user){
  		res.status(400).send('User does not exist.');
  	}
  	let profile = user.getProfile();
		profile.name.first = req.body.firstname;
		profile.name.last = req.body.lastname;
		profile.dateOfBirth = req.body.dob;
		profile.education = req.body.education;
		profile.career = req.body.career;
    profile.save();
  	res.status(200).send('Profile updated.');
  }).catch(function(err){
  	res.status(400).send({error: err});
  })
};

module.exports = profileController;