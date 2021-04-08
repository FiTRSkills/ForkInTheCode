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
    salary: jobPost.salary,
    benefits: jobPost.benefits,
    zipCode: jobPost.zipCode,
    description: jobPost.description,
    responsibilities: jobPost.responsibilities,
    amountOfJobs: jobPost.amountOfJobs,
    jobTimeline: jobPost.jobTimeline,
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
    let jobPost = new JobPosting({});
    // iterates through given information to add to course
    Object.keys(req.body).forEach(function (key) {
      jobPost[key] = req.body[key];
    });
    try {
      let profile = await req.user.getProfile();
      await jobPost.setOrganization(profile.organization.name);
      jobPost.save(function (err) {
        if (err) {
          res.status(400).send(err);
          return;
        }
        res.status(200).send("Successfully created jobposting.");
      });
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        res.status(400).send("Error adding skills.");
        return;
      }
      res.status(400).send("Error on jobposting creation.");
    }
  } else {
    res.status(400).send("Invalid usertype.");
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
    let profile = await req.user.getProfile();
    try {
      let jobpostings = await JobPosting.find({
        organization: profile.organization._id,
      }).exec();
      res.status(200).send(jobpostings);
    } catch (e) {
      res.status(400).send("Issue retrieving jobpostings");
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
    let profile = await req.user.getProfile();
    try {
      let jobposting = await JobPosting.findById(req.query._id);
      if (
        profile.organization._id.toString() ==
        jobposting.organization._id.toString()
      ) {
        res.status(200).send(jobposting);
      } else {
        res.status(400).send("User does not own this jobposting.");
      }
    } catch (e) {
      res.status(400).send("Issue retrieving jobposting.");
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
    let profile = await req.user.getProfile();
    try {
      let jobpost = await JobPosting.findById(req.body._id);
      if (
        profile.organization._id.toString() !=
        jobpost.organization._id.toString()
      ) {
        res.status(400).send("User does not own this jobposting.");
        return;
      }
      // iterates through given information to add to course
      Object.keys(req.body).forEach(function (key) {
        if (key != "_id") {
          jobpost[key] = req.body[key];
        }
      });
      jobpost.save(function (err) {
        if (err) {
          res.status(400).send(err);
          return;
        }
        res.status(200).send("Successfully updated jobposting.");
      });
    } catch (error) {
      res.status(400).send("Error editing jobposting.");
    }
  } else {
    res.status(400).send("Invalid usertype.");
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
    let profile = await req.user.getProfile();
    try {
      let post = await JobPosting.findById(req.body._id);
      if (
        profile.organization._id.toString() != post.organization._id.toString()
      ) {
        res.status(400).send("User does not own this jobposting.");
        return;
      }
      await post.remove();
      res.status(200).send("Successfully deleted jobposting.");
    } catch (error) {
      res.status(400).send("Error deleting jobposting.");
      return;
    }
  } else {
    res.status(400).send("Invalid usertype.");
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
