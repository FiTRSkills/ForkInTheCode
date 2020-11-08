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
    skills: profile.skills,
  };
  res.status(200).send(data);
};

/**
 * functionality for setting the profile
 * @name postProfile
 * @function
 * @alias module:/controllers/profilecontroller
 * @property {request} request - contains user
 * @returns {string} response - that profile was successfully updated
 */
profileController.postProfile = async function (req, res) {
  let profile = await req.user.getProfile();
  if (req.body.firstname) {
    profile.name.first = req.body.firstname;
  }
  if (req.body.lastname) {
    profile.name.last = req.body.lastname;
  }
  if (req.body.dob) {
    profile.dateOfBirth = Date.parse(req.body.dob);
  }
  profile.save();
  res.status(200).send("Profile Updated.");
};

/**
 * functionality for deleting an education
 * @name deleteEducation
 * @function
 * @alias module:/controllers/profilecontroller
 * @property {request} request - contains user
 * @returns {string} response - that profile was successfully updated
 */
profileController.deleteEducation = async function (req, res) {
  let profile = await req.user.getProfile();
  // gets the id of the education from the request
  await profile.removeEducation(req.body.id);
  res.status(200).send("Successfully removed education.");
};

/**
 * functionality for editing an education
 * @name patchEducation
 * @function
 * @alias module:/controllers/profilecontroller
 * @property {request} request - contains user
 * @returns {string} response - that profile was successfully updated
 */
profileController.patchEducation = async function (req, res) {
  let profile = await req.user.getProfile();
  // gets the id of the education from the request and the updated education
  await profile.editEducation(req.body.id, req.body.education);
  res.status(200).send("Successfully edited education.");
};

/**
 * functionality for adding an education
 * @name postEducation
 * @function
 * @alias module:/controllers/profilecontroller
 * @property {request} request - contains user
 * @returns {string} response - that profile was successfully updated
 */
profileController.postEducation = async function (req, res) {
  let profile = await req.user.getProfile();
  // gets the education to add from the request
  await profile.addEducation(
    req.body.degree,
    req.body.major,
    req.body.gradDate,
    req.body.organization
  );
  res.status(200).send("Successfully added education.");
};

/**
 * functionality for deleting a career
 * @name deleteCareer
 * @function
 * @alias module:/controllers/profilecontroller
 * @property {request} request - contains user
 * @returns {string} response - that profile was successfully updated
 */
profileController.deleteCareer = async function (req, res) {
  let profile = await req.user.getProfile();
  await profile.removeCareer(req.body.id);
  res.status(200).send("Successfully removed career.");
};

/**
 * functionality for editing a career
 * @name patchCareer
 * @function
 * @alias module:/controllers/profilecontroller
 * @property {request} request - contains user
 * @returns {string} response - that profile was successfully updated
 */
profileController.patchCareer = async function (req, res) {
  let profile = await req.user.getProfile();
  await profile.editCareer(req.body.id, req.body.career);
  res.status(200).send("Successfully edited career.");
};

/**
 * functionality for adding a career
 * @name postCareer
 * @function
 * @alias module:/controllers/profilecontroller
 * @property {request} request - contains user
 * @returns {string} response - that profile was successfully updated
 */
profileController.postCareer = async function (req, res) {
  let profile = await req.user.getProfile();
  await profile.addCareer(
    req.body.jobTitle,
    req.body.startDate,
    req.body.endDate,
    req.body.organization
  );
  res.status(200).send("Successfully added career.");
};

/**
 * functionality for deleting a skill
 * @name deleteSkill
 * @function
 * @alias module:/controllers/profilecontroller
 * @property {request} request - contains user
 * @returns {string} response - that skill was successfully updated
 */
profileController.deleteSkill = async function (req, res) {
  let profile = await req.user.getProfile();
  await profile.removeSkill(req.body.id);
  res.status(200).send("Successfully removed skill.");
};

/**
 * functionality for adding a skill
 * @name postSkill
 * @function
 * @alias module:/controllers/profilecontroller
 * @property {request} request - contains user
 * @returns {string} response - that skill was successfully updated
 */
profileController.postSkill = async function (req, res) {
  let profile = await req.user.getProfile();
  await profile.addSkill(req.body.skill);
  res.status(200).send("Successfully added skill.");
};

module.exports = profileController;
