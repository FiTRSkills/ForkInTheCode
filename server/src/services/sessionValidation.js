//route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.status(400).send("Access Denied.");
}

module.exports = isLoggedIn;
