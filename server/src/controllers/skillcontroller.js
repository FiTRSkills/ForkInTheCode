/** Module providing skill implementation for routes
 * @module controllers/skillcontroller
 */

const mongoose = require("mongoose");
const passport = require("passport");
const Skill = require("../models/skill");
const Search = require("../services/search");
const Course = require("../models/course");

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
	if (skills === undefined || skills.length == 0) {
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
	let results = await Search.findSkillsByZip(req.query.zipcode);
	//console.log(results);
	if (results === undefined || results.length == 0) {
		res.status(406).send("no skills exist");
		return;
	}
	res.status(200).send(results);
};

/**
 * functionality for getting a specific skill
 * @name skills
 * @function
 * @alias module:/controllers/skillcontroller
 * @property {request} request - skill id
 * @returns {string} response - skill information and related courses
 */
skillController.getSkill = async function (req, res) {
	let skill = "";
	try {
		skill = await Skill.findOne({ _id: req.query.id });
	} catch (CastError) {
		res.status(406).send("skill does not exist");
		return;
	}
	// if the skill does not exst return error
	if (!skill) {
		res.status(406).send("skill does not exist");
		return;
	}
	// get courses associated with the skill
	let courses = await Course.findAllBySkill(skill._id);
	let skill_info = {
		skill: skill,
		courses: courses,
	};
	res.status(200).send(skill_info);
};

module.exports = skillController;
