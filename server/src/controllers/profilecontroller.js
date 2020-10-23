/** Module providing user implementation for routes
 * @module controllers/profilecontroller
 */

const mongoose = require("mongoose");
const passport = require("passport");

const profileController = {};

/**
 * functionality for getting the profile
 * @name getProfile
 * @function
 * @alias module:/controllers/profilecontroller
 * @property {request} request - contains user
 * @returns {string} response - the user profile or error if not found
 */
profileController.getProfile = function (req, res) {
  User.find({email: req.user.email}).then(function(user){
  	if(!user){
  		res.status(400).send('User does not exist.');
  	}
  	let profile = user.getProfile();
  	data = {
  		firstname: profile.name.first,
  		lastname: profile.name.last,
  		dob: profile.dateOfBirth,
  		education: profile.education,
  		career: profile.career,
  	}
  	res.status(200).send(data);
  }).catch(function(err)){
  	res.status(400).send({error: err});
  }
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
  	data = {
  		firstname: profile.name.first,
  		lastname: profile.name.last,
  		dob: profile.dateOfBirth,
  		education: profile.education,
  		career: profile.career,
  	}
  	res.status(200).send('Profile updated.');
  }).catch(function(err)){
  	res.status(400).send({error: err});
  }
};

module.exports = profileController;