const { validationResult } = require("express-validator");

const validation = {};

validation.validateInput = function (req, res, next) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(400).send({ errors: errors.array() });
	} else {
		return next();
	}
};

validation.validateSession = function (req, res, next) {
	if (req.isAuthenticated()) return next();
	res.status(400).send("Access Denied.");
};

module.exports = validation;
