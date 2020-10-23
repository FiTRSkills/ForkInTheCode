/** Express router providing user related routes
 * @module routers/users
 * @requires express
 */

var express = require("express");
var router = express.Router();
var auth = require("../controllers/authcontroller.js");
var profile = require("../controllers/profilecontroller.js")

/**
 * Routing serving registration
 * @name POST /register
 * @function
 * @alias module:/routers/users
 * @property {string} username - the email for the new account
 * @property {string} password - the password for the new account
 * @property {string} usertype - the usertype for the new account (EducatorProfile, EmployerProfile, JobSeekerProfile)
 * @returns {json} Success or Failure message
 */
router.post("/register", auth.doRegister);

/**
 * Routing serving login
 * @name POST /login
 * @function
 * @alias module:/routers/users
 * @property {string} username - the email of the account to login
 * @property {string} password - the password of the account to login
 * @returns {json} returns the user.username upon success and Unauthorized on failure
 */
router.post("/login", auth.doLogin);

/**
 * Routing serving logout
 * @name GET /logout
 * @function
 * @alias module:/routers/users
 * @returns {json} text of Successfully logged out
 */
router.get("/logout", auth.logout);

/**
 * Routing serving getting profile information
 * @name GET /profile
 * @function
 * @alias module:/routers/profile
 * @property {string} user - the user token for the session
 * @returns {json} of user profile infromation
 */
router.get("/profile", isLoggedIn, profile.getProfile);

/**
 * Routing serving updating profile information
 * @name POST /profile
 * @function
 * @alias module:/routers/profile
 * @property {string} user - the user token for the session
 * @property {json} profile - the updated profile
 * @returns {string} message - success message
 */
router.post("/profile", isLoggedIn, profile.postProfile);

//The 404 Route (ALWAYS Keep this as the last route)
router.get('*', function(req, res){
  res.send('Not Found', 404);
});

module.exports = router;

//route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.status(400).send('Access Denied.');
}
