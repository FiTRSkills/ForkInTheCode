/** Module providing skill implementation for routes
 * @module controllers/skillcontroller
 */

const mongoose = require("mongoose");
const passport = require("passport");
const Skill = require("../models/skill");

const skillController = {};

/**
 * functionality for getting all skills
 * @name skills
 * @function
 * @alias module:/controllers/skillcontroller
 * @property {request} request - none
 * @returns {string} response - all skills
 */
skillController.skills = async function (req, res) {
	let skills = await Skill.find();
	if (!skills) {
		res.status(406).send("no skills exist");
		return;
	}
	res.status(200).send(skills);
};

/**
 * functionality for getting skills within a zipcode and their
 * number of jobs
 * @name skillsSearch
 * @function
 * @alias module:/controllers/skillcontroller
 * @property {request} request - contains zipcode
 * @returns {string} response - skills and number of jobs skills are in
 */
skillController.skillsSearch = async function (req, res) {
	// can we have zipcodes and Jobnum associated with skils?
	// for instance when a new jobposting is created it adds
	// the zipcode to a list of zipcodes in the skills and if
	// the zipcode is already there it +1s it
	// so like zipcodes: {18938: 1, 12039: 5} etc
	// for organization search based on string filter via Org job postings with skills
	// search job postings with Org
	// for posting in job postings
	// add skills to skills list
	// if skill exists update 1
};

/**
 * functionality for getting a specific skill
 * @name skills
 * @function
 * @alias module:/controllers/skillcontroller
 * @property {request} request - skill id
 * @returns {string} response - skill information
 */
skillController.getSkill = async function (req, res) {
	let skill = await Skill.findOne({ _id: req.body.id });
	// if the skill does not exst return error
	if (!skill) {
		res.status(406).send("skill does not exist");
		return;
	}
	res.status(200).send(skill);
};

module.exports = skillController;
