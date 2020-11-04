//route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	console.log(req.user);
	console.log(req.cookies);
    if (req.isAuthenticated())
        return next();
    res.status(400).send('Access Denied.');
}

module.exports = isLoggedIn;