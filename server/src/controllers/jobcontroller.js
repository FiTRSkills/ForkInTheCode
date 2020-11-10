/** Module providing job posting implementation for routes
 * @module controllers/jobcontroller
 */
const mongoose = require("mongoose");
const passport = require("passport");
const jobPosting = require("../models/jobPosting");
const organization = require("../models/organization");

const jobController = {};

/**
 * functionality for getting a specific job posting
 * @name getJobPosting
 * @function
 * @alias module:/controllers/jobcontroller
 * @property {request} request - contains user
 * @returns {string} response - the job posting or error if not found
 */
jobController.getJobPosting = async function (req, res) {
  let jobPost = await jobPosting.getJobPosting(req.body.id, function (err) {
    if (err) {
      res.status(400).send("Error retrieving job posting.");
      return;
    }
    res.status(200).send(jobPost);
  });
};

/**
 * functionality for creating a specific job posting
 * @name createJobPosting
 * @function
 * @alias module:/controllers/jobcontroller
 * @property {request} request - contains user
 * @returns {string} response - the created job posting id
 */
jobController.createJobPosting = async function (req, res) {
  // add check that usertype is Employer after this sprint
  let jobPost = new jobPosting({
    jobTitle: req.body.jobTitle,
    pay: req.body.pay,
    code: req.body.code,
    description: req.body.description,
    qualification: req.body.qualification,
  });
  await jobPost.setOrganization(req.body.organization);
  await jobPost.addSkills(req.body.skills);
  jobPost.save(function (err) {
    if (err) {
      res.status(400).send(err);
      return;
    }
    res.status(200).send(jobPost);
  });
};

/**
 * functionality for searching for job postings
 * @name searchJobPostings
 * @function
 * @alias module:/controllers/jobcontroller
 * @property {request} request - contains user
 * @returns {string} response - the created job posting id
 */
jobController.searchJobPostings = async function (req, res) {
  let searchResults = await jobPosting.search({
    zipCode: req.body.zipcode,
    skills: req.body.skills,
  });
  res.status(200).send(searchResults);
};

module.exports = jobController;
