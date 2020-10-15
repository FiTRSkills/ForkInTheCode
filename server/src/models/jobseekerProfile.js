const mongoose = require("mongoose");

/**
 * Profile information for job seekers.
 *
 * @type {Schema}
 */
const JobSeekerProfile = new mongoose.Schema({
  name: {
    first: String,
    last: String,
  },
});

module.exports = mongoose.model("JobSeekerProfile", JobSeekerProfile);
