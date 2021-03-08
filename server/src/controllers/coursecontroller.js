/** Module providing course implementation for routes
 * @module controllers/coursecontroller
 */

const Course = require("../models/course");

const courseController = {};

courseController.addCourse = async function (req, res) {
	if (req.user.type == "EducatorProfile") {
		return;
	} else {
		res.status(400).send("Invalid usertype.");
	}
};

courseController.updateCourse = async function (req, res) {
	if (req.user.type == "EducatorProfile") {
		return;
	} else {
		res.status(400).send("Invalid usertype.");
	}
};

courseController.deleteCourse = async function (req, res) {
	if (req.user.type == "EducatorProfile") {
		return;
	} else {
		res.status(400).send("Invalid usertype.");
	}
};

courseController.viewCourses = async function (req, res) {
	if (req.user.type == "EducatorProfile") {
		return;
	} else {
		res.status(400).send("Invalid usertype.");
	}
};

module.exports = courseController;
