/** Module providing job posting implementation for routes
 * @module controllers/jobcontroller
 */
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../models/user");
const JobPosting = require("../models/jobPosting");

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
  let jobPost = await JobPosting.getJobPosting(req.query.id);
  if (jobPost == null) {
    res
      .status(400)
      .send("Job post with id " + req.query.id + " does not exist.");
    return;
  }
  data = {
    id: jobPost._id,
    jobTitle: jobPost.jobTitle,
    pay: jobPost.pay,
    code: jobPost.code,
    zipCode: jobPost.zipCode,
    description: jobPost.description,
    qualifications: jobPost.qualifications,
    organization: jobPost.organization,
    skills: jobPost.skills,
  };
  res.status(200).send(data);
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
  if (req.user.type == User.Type.EMPLOYER) {
    let jobPost = new JobPosting({
      jobTitle: req.body.jobTitle,
      pay: req.body.pay,
      code: req.body.code,
      zipCode: req.body.zipCode,
      description: req.body.description,
      qualifications: req.body.qualifications,
    });
    await jobPost.setOrganization(req.body.organization);
    await jobPost.addSkills(req.body.skills);
    jobPost.save(function (err) {
      if (err) {
        res.status(400).send(err);
        return;
      }
      data = {
        id: jobPost._id,
        jobTitle: jobPost.jobTitle,
        pay: jobPost.pay,
        code: jobPost.code,
        zipCode: jobPost.zipCode,
        description: jobPost.description,
        qualifications: jobPost.qualifications,
        organization: jobPost.organization,
        skills: jobPost.skills,
      };
      res.status(200).send(data);
    });
  } else {
    res.status(400).send("Invalid usertype to create job postings.");
  }
};

/**
 * functionality for viewing all created job postings
 * @name viewJobPostings
 * @function
 * @alias module:/controllers/jobcontroller
 * @property {request} request - contains user
 * @returns {string} response - the job postings
 */
jobController.viewJobPostings = async function (req, res) {
  if (req.user.type == User.Type.EMPLOYER) {
    let org = req.user.organization;
    try{
      let jobpostings = await JobPosting.search({organization: org})
      res.status(200).send(org);
    }catch (e){
      res.status.send("Issue retrieving jobpostings");
    }
  } else {
    res.status(400).send("Invalid usertype to view job postings.");
  }
};

/**
 * functionality for getting a jobposting user created
 * @name getMyJobPostings
 * @function
 * @alias module:/controllers/jobcontroller
 * @property {request} request - id
 * @returns {string} response - the job posting
 */
jobController.getMyJobPosting = async function (req, res) {
  if (req.user.type == User.Type.EMPLOYER) {
    let org = req.user.organization;
    try{
      let jobpostings = await JobPosting.search({organization: org})
      res.status(200).send(org);
    }catch (e){
      res.status.send("Issue retrieving jobpostings");
    }
  } else {
    res.status(400).send("Invalid usertype to view job postings.");
  }
};

/**
 * functionality for editing a jobposting user created
 * @name editMyJobPostings
 * @function
 * @alias module:/controllers/jobcontroller
 * @property {request} request - job posting
 * @returns {string} response - success msg
 */
jobController.editMyJobPosting = async function (req, res) {
  if (req.user.type == User.Type.EMPLOYER) {
    let org = req.user.organization;
    try{
      let jobpostings = await JobPosting.search({organization: org})
      res.status(200).send(org);
    }catch (e){
      res.status.send("Issue retrieving jobpostings");
    }
  } else {
    res.status(400).send("Invalid usertype to view job postings.");
  }
};

/**
 * functionality for deleting a jobposting user created
 * @name deleteMyJobPostings
 * @function
 * @alias module:/controllers/jobcontroller
 * @property {request} request - id
 * @returns {string} response - success msg
 */
jobController.deleteMyJobPosting = async function (req, res) {
  if (req.user.type == User.Type.EMPLOYER) {
    let org = req.user.organization;
    try{
      let jobpostings = await JobPosting.search({organization: org})
      res.status(200).send(org);
    }catch (e){
      res.status.send("Issue retrieving jobpostings");
    }
  } else {
    res.status(400).send("Invalid usertype to view job postings.");
  }
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
  try {
    let searchResults = await JobPosting.search({
      zipCode: req.body.zipCode,
      skills: req.body.skills,
    });
    if (searchResults == null) {
      res.status(400).send("No results");
      return;
    }
    res.status(200).send(searchResults);
  } catch (e) {
    console.log(e);
    res.status(400).send("Unable to search for skills.");
  }
};

module.exports = jobController;
