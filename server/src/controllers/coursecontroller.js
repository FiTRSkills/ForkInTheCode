/** Module providing course implementation for routes
 * @module controllers/coursecontroller
 */

const Course = require("../models/course");
const User = require("../models/user");
const mongoose = require("mongoose");

const courseController = {};

/**
 * functionality for adding a course
 * @name course
 * @function
 * @alias module:/controllers/coursecontroller
 * @property {request} request - course information
 * @returns {string} response - success or failure
 */
courseController.addCourse = async function (req, res) {
	if (req.user.type == "EducatorProfile") {
		let course = new Course({});
		// iterates through given information to add to course
		Object.keys(req.body).forEach(function (key) {
			if (key != "skills") {
				course[key] = req.body[key];
			}
		});
		try {
			await course.addSkills(req.body.skills);
			let profile = await req.user.getProfile();
			await course.setOrganization(profile.organization.name);
			course.save(function (err) {
				if (err) {
					res.status(400).send(err);
					return;
				}
				res.status(200).send("Successfully created course.");
			});
		} catch (error) {
			if (error instanceof mongoose.Error.CastError) {
				res.status(400).send("Error adding skills.");
				return;
			}
			res.status(400).send("Error on course creation.");
			console.log(error);
		}
	} else {
		res.status(400).send("Invalid usertype.");
	}
};

/**
 * functionality for updating a course
 * @name course
 * @function
 * @alias module:/controllers/coursecontroller
 * @property {request} request - course information
 * @returns {string} response - success or failure
 */
courseController.updateCourse = async function (req, res) {
	if (req.user.type == "EducatorProfile") {
		try {
			let course = await Course.findById(req.body._id);
			// iterates through given information to add to course
			Object.keys(req.body).forEach(function (key) {
				if (key != "_id" && key != "skills") {
					course[key] = req.body[key];
				}
			});
			await course.addSkills(req.body.skills);
			course.save(function (err) {
				if (err) {
					res.status(400).send(err);
					return;
				}
				res.status(200).send("Successfully created course.");
			});
		} catch (error) {
			res.status(400).send("Error editing course.");
		}
	} else {
		res.status(400).send("Invalid usertype.");
	}
};

/**
 * functionality for deleting a course
 * @name course
 * @function
 * @alias module:/controllers/coursecontroller
 * @property {request} request - course id
 * @returns {string} response - success or failure
 */
courseController.deleteCourse = async function (req, res) {
	if (req.user.type == "EducatorProfile") {
		try {
			await (await Course.findById(req.body._id)).remove();
			res.status(200).send("Successfully deleted course.");
		} catch (error) {
			res.status(400).send("Error deleting course.");
			return;
		}
	} else {
		res.status(400).send("Invalid usertype.");
	}
};

/**
 * functionality for viewing educator user's courses
 * @name course
 * @function
 * @alias module:/controllers/coursecontroller
 * @property {request} request - nothing
 * @returns {string} response - list of courses
 */
courseController.viewCourses = async function (req, res) {
	if (req.user.type == "EducatorProfile") {
		try {
			let profile = await req.user.getProfile();
			courses = await Course.find({
				organization: profile.organization._id,
			}).exec();
			res.status(200).send(courses);
		} catch (error) {
			res.status(400).send("Error getting courses.");
		}
	} else {
		res.status(400).send("Invalid usertype.");
	}
};

module.exports = courseController;
