/** Module providing course implementation for routes
 * @module controllers/coursecontroller
 */

const Course = require("../models/course");

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
		return;
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
		return;
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
		return;
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
		return;
	} else {
		res.status(400).send("Invalid usertype.");
	}
};

module.exports = courseController;
