/** Express router providing user related routes
 * @module routers/users
 * @requires express
 */
const { check, oneOf } = require("express-validator");
var express = require("express");
var router = express.Router();
var auth = require("../controllers/authcontroller.js");
var profile = require("../controllers/profilecontroller.js");
var job = require("../controllers/jobcontroller.js");
var skill = require("../controllers/skillcontroller.js");
var course = require("../controllers/coursecontroller.js");
var validation = require("../services/validation.js");

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
  validation.validateInput,
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
 * @returns {string} firstname - the first name
 * @returns {string} lastname - the last name
 * @returns {Date} dob - the date of birth
 */
router.get("/profile", validation.validateSession, profile.getProfile);

/**
 * Routing serving updating profile information
 * @name POST /profile
 * @function
 * @alias module:/routers/profile
 * @property {string} firstname - the first name
 * @property {string} lastname - the last name
 * @property {string} dob - the date of birth YYYY/MM/DD
 * @returns {string} message - success message
 */
router.post(
  "/profile",
  validation.validateSession,
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
  validation.validateInput,
  profile.postProfile
);

/**
 * Routing serving removing an education
 * @name DELETE /profile/education
 * @function
 * @alias module:/routers/profile
 * @property {string} id - the id of the education
 * @returns {string} message - success message
 */
router.delete(
  "/profile/education",
  validation.validateSession,
  [check("id", "Must send a viable ID").not().isEmpty()],
  validation.validateInput,
  profile.deleteEducation
);

/**
 * Routing serving updating an education
 * @name PATCH /profile/education
 * @function
 * @alias module:/routers/profile
 * @property {string} id - the id of the education
 * @property {string} education -  the education object getting updated
 * @returns {string} message - success message
 */
router.patch(
  "/profile/education",
  validation.validateSession,
  [
    check("id", "Must send a viable ID").not().isEmpty(),
    check("degree", "Must send a viable degree").not().isEmpty(),
    check("gradDate", "Must send a viable gradDate").not().isEmpty(),
    check("major", "Must send a viable major").not().isEmpty(),
    check("organization", "Must send a viable organization").not().isEmpty(),
  ],
  validation.validateInput,
  profile.patchEducation
);

/**
 * Routing serving adding an education
 * @name POST /profile/education
 * @function
 * @alias module:/routers/profile
 * @property {string} degree -  the degree type
 * @property {string} major -  the major
 * @property {string} gradDate -  the graduation date
 * @property {string} organization -  the organization/college name
 * @returns {string} message - success message
 */
router.post(
  "/profile/education",
  validation.validateSession,
  [
    check("degree", "Must send a viable degree").not().isEmpty(),
    check("gradDate", "Must send a viable gradDate").not().isEmpty(),
    check("major", "Must send a viable major").not().isEmpty(),
    check("organization", "Must send a viable organization").not().isEmpty(),
  ],
  validation.validateInput,
  profile.postEducation
);

/**
 * Routing serving removing a career
 * @name DELETE /profile/career
 * @function
 * @alias module:/routers/profile
 * @property {string} id - the id of the career
 * @returns {string} message - success message
 */
router.delete(
  "/profile/career",
  validation.validateSession,
  [check("id", "Must send a viable ID").not().isEmpty()],
  validation.validateInput,
  profile.deleteCareer
);

/**
 * Routing serving updating a career
 * @name PATCH /profile/career
 * @function
 * @alias module:/routers/profile
 * @property {string} id - the id from the career object
 * @property {string} career -  the career object
 * @returns {string} message - success message
 */
router.patch(
  "/profile/career",
  validation.validateSession,
  [
    check("id", "Must send a viable ID").not().isEmpty(),
    check("jobTitle", "Must send a viable job title").not().isEmpty(),
    check("endDate", "Must send a viable endDate").not().isEmpty(),
    check("startDate", "Must send a viable startDate").not().isEmpty(),
    check("organization", "Must send a viable organization").not().isEmpty(),
  ],
  validation.validateInput,
  validation.dateRange,
  profile.patchCareer
);

/**
 * Routing serving adding a career
 * @name POST /profile/career
 * @function
 * @alias module:/routers/profile
 * @property {string} jobTitle -  the jobtitle
 * @property {string} endDate -  the end date of the job
 * @property {string} startDate -  the state date of the job
 * @property {string} organization -  the organization name
 * @returns {string} message - success message
 */
router.post(
  "/profile/career",
  validation.validateSession,
  [
    check("jobTitle", "Must send a viable job title").not().isEmpty(),
    check("endDate", "Must send a viable endDate").not().isEmpty(),
    check("startDate", "Must send a viable startDate").not().isEmpty(),
    check("organization", "Must send a viable organization").not().isEmpty(),
  ],
  validation.validateInput,
  validation.dateRange,
  profile.postCareer
);

/**
 * Routing serving retrieving a job posting by id
 * @name GET /jobs/jobposting
 * @function
 * @alias module:/routers/job
 * @property {string} id -  the job posting id
 * @returns {string} message - success message
 */
router.get("/jobs/jobposting", job.getJobPosting);

/**
 * Routing serving retrieving an organization's job postings
 * @name GET /jobPostings
 * @function
 * @alias module:/routers/job
 * @property {string} user -  the user session
 * @returns {string} array - job postings
 */
router.get("/jobPostings", validation.validateSession, job.viewJobPostings);

/**
 * Routing serving retrieving a job posting by id
 * @name POST /jobPosting
 * @function
 * @alias module:/routers/job
 * @property {string} id -  the job posting id
 * @returns {string} message - success message
 */
router.get(
  "/jobPosting",
  validation.validateSession,
  [check("_id", "Must send a viable ID").not().isEmpty()],
  validation.validateInput,
  job.getMyJobPosting
);

/**
 * Routing serving retrieving a job posting by id
 * @name PATCH /jobPosting
 * @function
 * @alias module:/routers/job
 * @property {string} id -  the job posting id and edits
 * @returns {string} message - success message
 */
router.patch(
  "/jobPosting",
  validation.validateSession,
  [
    check("_id", "Must send a viable course _id").not().isEmpty(),
    check("jobTitle", "Must send a viable job title").exists(),
    check("salary", "Must send a viable salary").exists(),
    check("zipCode", "Must send a viable zipcode").exists(),
    check("description", "Must send a viable description").exists(),
    check("amountOfJobs", "Must send a viable amountOfJobs").exists(),
    check("jobTimeline", "Must send a viable jobTimeline").exists(),
    check("benefits", "Must send a viable benefits").exists(),
    check("location", "Must send a viable location").exists(),
    check("responsibilities", "Must send viable responsibilities").exists(),
    check("skills", "Must send viable skills").exists(),
    check("courses", "Must send viable courses").exists(),
  ],
  validation.validateInput,
  job.editMyJobPosting
);

/**
 * Routing serving retrieving a job posting by id
 * @name DELETE /jobPosting
 * @function
 * @alias module:/routers/job
 * @property {string} id -  the job posting id
 * @returns {string} message - success message
 */
router.delete(
  "/jobPosting",
  validation.validateSession,
  [check("_id", "Must send a viable ID").not().isEmpty()],
  validation.validateInput,
  job.deleteMyJobPosting
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
  "/jobPosting",
  validation.validateSession,
  [
    check("jobTitle", "Must send a viable job title").not().isEmpty(),
    check("zipCode", "Must send a viable zipcode").not().isEmpty(),
    check("location", "Must send a viable location").not().isEmpty(),
    check("description", "Must send a viable description").not().isEmpty(),
    check("skills", "Must send viable skills").not().isEmpty(),
  ],
  validation.validateInput,
  job.createJobPosting
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
  "/JobSearch",
  [
    check("zipCode", "Must send a viable zipcode").not().isEmpty(),
    check("skills", "Must send a viable skills list").optional({
      nullable: true,
    }),
  ],
  validation.validateInput,
  job.searchJobPostings
);

/*
 * Routing serving removing a skill
 * @name DELETE /profile/skill
 * @function
 * @alias module:/routers/profile
 * @property {string} id - the id of the skill
 * @returns {string} message - success message
 */
router.delete(
  "/profile/skill",
  validation.validateSession,
  [check("id", "Must send a viable ID").not().isEmpty()],
  validation.validateInput,
  profile.deleteSkill
);

/**
 * Routing serving adding a skill
 * @name POST /profile/skill
 * @function
 * @alias module:/routers/profile
 * @property {string} skill -  the skill
 * @returns {string} message - success message
 */
router.post(
  "/profile/skill",
  validation.validateSession,
  [check("skills", "Must send a viable list of skill ids").not().isEmpty()],
  validation.validateInput,
  profile.postSkill
);

/**
 * Routing serving retrieving logged in user's usertype
 * @name GET /profile/usertype
 * @function
 * @alias module:/routers/profile
 * @returns {string} message - the usertype
 */
router.get(
  "/profile/usertype",
  validation.validateSession,
  profile.getUserType
);

/**
 * Routing serving adding a skill
 * @name GET /skills
 * @function
 * @alias module:/routers/skill
 * @returns {Array} skills - all skills in database
 */
router.get("/skills", skill.skills);

/**
 * Routing serving searching for skills
 * @name GET /skills
 * @function
 * @alias module:/routers/skill
 * @returns {Array} skills - all skills in search results
 */
router.get(
  "/skills/search",
  oneOf(
    // <-- one of the following must exist
    [
      check("zipCode", "Must send a viable zipcode").not().isEmpty(),
      check("organization", "Must send a viable organization").not().isEmpty(),
    ]
  ),
  validation.validateInput,
  skill.skillsSearch
);

/**
 * Routing serving getting singular skill by id
 * @name GET /skills/getSkills
 * @function
 * @alias module:/routers/skill
 * @returns {Object} skill - matching skill
 */
router.get(
  "/skills/getSkill",
  [check("id", "Must send a viable skill id").not().isEmpty()],
  validation.validateInput,
  skill.getSkill
);

/**
 * Routing serving getting singular skill by id
 * @name GET /skills/getSkills
 * @function
 * @alias module:/routers/skill
 * @returns {Object} skill - matching skill
 */
router.post(
  "/skills/createSkill",
  [
    check("name", "Must send a viable skill name").not().isEmpty(),
    check("description", "Must send a skill description").not().isEmpty(),
  ],
  validation.validateInput,
  skill.createSkill
);

/**
 * Routing serving viewing all the user's courses (educator only)
 * @name POST /courses
 * @function
 * @alias module:/routers/course
 * @returns {List} courses - list of course objects
 */
router.get("/courses", validation.validateSession, course.viewCourses);

/**
 * Routing serving adding a course
 * @name POST /courses/course
 * @function
 * @alias module:/routers/course
 * @returns {String} msg - success or failure
 */
router.post(
  "/courses/course",
  validation.validateSession,
  [
    check("location", "Must send a viable location").not().isEmpty(),
    check("name", "Must send a viable name").not().isEmpty(),
    check("skills", "Must send a viable list of skills").not().isEmpty(),
  ],
  validation.validateInput,
  course.addCourse
);

/**
 * Routing serving updating a course
 * @name PATCH /courses/course
 * @function
 * @alias module:/routers/course
 * @returns {String} msg - success or failure
 */
router.patch(
  "/courses/course",
  validation.validateSession,
  [
    check("_id", "Must send a viable course _id").not().isEmpty(),
    check("location", "Must send a viable location").not().isEmpty(),
    check("name", "Must send a viable name").not().isEmpty(),
    check("skills", "Must send a viable list of skills").not().isEmpty(),
    check("contact", "Contact must exist").exists(),
    check("period", "Period must exist").exists(),
    check("times", "Times must exist").exists(),
    check("description", "Description must exist").exists(),
    check("moneyCost", "moneyCost must exist").exists(),
    check("timeCost", "timeCost must exist").exists(),
    check("requiredEquipment", "requiredEquipment must exist").exists(),
  ],
  validation.validateInput,
  course.updateCourse
);

/**
 * Routing serving deleting a course
 * @name DELETE /courses/course
 * @function
 * @alias module:/routers/course
 * @returns {String} msg - success or failure
 */
router.delete(
  "/courses/course",
  validation.validateSession,
  [check("_id", "Must send a viable course id").not().isEmpty()],
  validation.validateInput,
  course.deleteCourse
);

/**
 * Routing serving finding a course
 * @name GET /courses/search
 * @function
 * @alias module:/routers/course
 * @returns {String} msg - success or failure
 */
router.get(
  "/courses/search",
  validation.validateSession,
  [
    check("skills", "Must send viable skills").not().isEmpty(),
    check("searchValue", "Must send viable searchValue").not().isEmpty(),
  ],
  validation.validateInput,
  course.searchCourses
);

module.exports = router;
