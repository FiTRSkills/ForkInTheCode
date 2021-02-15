const { validationResult } = require("express-validator");

const validation = {};

// validates the input is sanitized
validation.validateInput = function (req, res, next) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(400).send({ errors: errors.array() });
	} else {
		return next();
	}
};

// validates the user is logged into the session
validation.validateSession = function (req, res, next) {
	if (req.isAuthenticated()) return next();
	res.status(400).send("Access Denied.");
};

// validates that the start date is before the end date
validation.dateRange = function (req, res, next) {
	let startDate = new Date(req.body.startDate);
	let endDate = new Date(req.body.endDate);
	if (startDate.getTime() >= endDate.getTime()) {
		res.status(400).send("End date cannot be before start date.");
	} else {
		return next();
	}
};

module.exports = validation;
