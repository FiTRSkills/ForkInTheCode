/** Express router providing user related routes
 * @module routers/users
 * @requires express
 */
const { check } = require("express-validator");
var express = require("express");
var router = express.Router();
var auth = require("../controllers/authcontroller.js");
var profile = require("../controllers/profilecontroller.js");
var job = require("../controllers/jobcontroller.js");
var inputValidation = require("../services/inputValidation.js");
var sessionValidation = require("../services/sessionValidation.js");

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
router.post(
  "/register",
  [
    check("email", "Your email is not valid")
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail(),
    check("password", "Must send a password").not().isEmpty().trim().escape(),
    check("usertype", "Must send a usertype").not().isEmpty().trim().escape(),
  ],
  inputValidation,
  auth.doRegister
);

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
router.get("/profile", sessionValidation, profile.getProfile);

/**
 * Routing serving updating profile information
 * @name POST /profile
 * @function
 * @alias module:/routers/profile
 * @property {string} user - the user token for the session
 * @property {json} profile - the updated profile
 * @returns {string} message - success message
 */
router.post(
  "/profile",
  sessionValidation,
  [
    check("firstname", "Must send a viable firstname")
      .trim()
      .escape()
      .optional({ nullable: true }),
    check("lastname", "Must send a viable lastname")
      .trim()
      .escape()
      .optional({ nullable: true }),
    check("dob", "Must send a viable dob")
      .isDate()
      .optional({ nullable: true }),
  ],
  inputValidation,
  profile.postProfile
);

/**
 * Routing serving adding an education
 * @name DELETE /profile/education
 * @function
 * @alias module:/routers/profile
 * @property {string} user - the user token for the session
 * @property {string} id - the id of the education
 * @returns {string} message - success message
 */
router.delete(
  "/profile/education",
  sessionValidation,
  [check("id", "Must send a viable ID").not().isEmpty()],
  inputValidation,
  profile.deleteEducation
);

/**
 * Routing serving updating an education
 * @name PATCH /profile/education
 * @function
 * @alias module:/routers/profile
 * @property {string} user - the user token for the session
 * @property {string} id - the id of the education
 * @property {string} education -  the updated version of the education
 * @returns {string} message - success message
 */
router.patch(
  "/profile/education",
  sessionValidation,
  [
    check("id", "Must send a viable ID").not().isEmpty(),
    check("degree", "Must send a viable degree")
      .not()
      .isEmpty()
      .optional({ nullable: true }),
    check("gradDate", "Must send a viable gradDate")
      .not()
      .isEmpty()
      .optional({ nullable: true }),
    check("major", "Must send a viable major")
      .not()
      .isEmpty()
      .optional({ nullable: true }),
    check("organization", "Must send a viable organization")
      .not()
      .isEmpty()
      .optional({ nullable: true }),
  ],
  inputValidation,
  profile.patchEducation
);

/**
 * Routing serving adding an education
 * @name POST /profile/education
 * @function
 * @alias module:/routers/profile
 * @property {string} user - the user token for the session
 * @property {string} education -  the updated version of the education
 * @returns {string} message - success message
 */
router.post(
  "/profile/education",
  sessionValidation,
  [
    check("degree", "Must send a viable degree").not().isEmpty(),
    check("gradDate", "Must send a viable gradDate").not().isEmpty(),
    check("major", "Must send a viable major").not().isEmpty(),
    check("organization", "Must send a viable organization").not().isEmpty(),
  ],
  inputValidation,
  profile.postEducation
);

/**
 * Routing serving adding a career
 * @name DELETE /profile/career
 * @function
 * @alias module:/routers/profile
 * @property {string} user - the user token for the session
 * @property {string} id - the id of the education
 * @returns {string} message - success message
 */
router.delete(
  "/profile/career",
  sessionValidation,
  [check("id", "Must send a viable ID").not().isEmpty()],
  inputValidation,
  profile.deleteCareer
);

/**
 * Routing serving updating a career
 * @name PATCH /profile/career
 * @function
 * @alias module:/routers/profile
 * @property {string} user - the user token for the session
 * @property {string} id - the id of the education
 * @property {string} education -  the updated version of the education
 * @returns {string} message - success message
 */
router.patch(
  "/profile/career",
  sessionValidation,
  [
    check("id", "Must send a viable ID").not().isEmpty(),
    check("jobTitle", "Must send a viable job title")
      .not()
      .isEmpty()
      .optional({ nullable: true }),
    check("endDate", "Must send a viable endDate")
      .not()
      .isEmpty()
      .optional({ nullable: true }),
    check("startDate", "Must send a viable startDate")
      .not()
      .isEmpty()
      .optional({ nullable: true }),
    check("organization", "Must send a viable organization")
      .not()
      .isEmpty()
      .optional({ nullable: true }),
  ],
  inputValidation,
  profile.patchCareer
);

/**
 * Routing serving adding a career
 * @name POST /profile/career
 * @function
 * @alias module:/routers/profile
 * @property {string} user - the user token for the session
 * @property {string} education -  the updated version of the education
 * @returns {string} message - success message
 */
router.post(
  "/profile/career",
  sessionValidation,
  [
    check("jobTitle", "Must send a viable job title").not().isEmpty(),
    check("endDate", "Must send a viable endDate").not().isEmpty(),
    check("startDate", "Must send a viable startDate").not().isEmpty(),
    check("organization", "Must send a viable organization").not().isEmpty(),
  ],
  inputValidation,
  profile.postCareer
);

/**
 * Routing serving retrieving a job posting by id
 * @name POST /jobs/jobposting
 * @function
 * @alias module:/routers/job
 * @property {string} id -  the job posting id
 * @returns {string} message - success message
 */
router.post(
  "/jobs/jobposting",
  sessionValidation,
  [check("id", "Must send a viable ID").not().isEmpty()],
  inputValidation,
  job.getJobPosting
);

/**
 * Routing serving retrieving a job posting by id
 * @name POST /jobs/createjobposting
 * @function
 * @alias module:/routers/job
 * @property {string} id -  the job posting id
 * @returns {string} message - success message
 */
router.post(
  "/jobs/createjobposting",
  sessionValidation,
  [//todo],
  inputValidation,
  job.getJobPosting
);

/**
 * Routing serving retrieving a job posting by id
 * @name POST /profile/career
 * @function
 * @alias module:/routers/job
 * @property {string} zip_code -  the zip_code to search in
 * @property {string} skills -  a list of skills string
 * @returns {string} message - success message
 */
router.post(
  "/jobs/search",
  sessionValidation,
  [check("zip_code", "Must send a viable zipcode").not().isEmpty(), 
  check("skills", "Must send a viable skills list").not().isEmpty()],
  inputValidation,
  job.searchJobPostings
);

//The 404 Route handles returns on routes that don't exist
router.get("*", function (req, res) {
  res.status(404).send("Not Found");
});

module.exports = router;
