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
profileController.postProfile = async function (req, res) {
	let profile = await req.user.getProfile();
	profile.name.first = req.body.firstname;
	profile.name.last = req.body.lastname;
	profile.dateOfBirth = Date.parse(req.body.dob);
  if (req.body.education != ""){
	 profile.education = req.body.education;
  }
	if (req.body.career != ""){
    profile.career = req.body.career;
  }
  profile.save();
	res.status(200).send('Profile Updated.');
};

module.exports = profileController;