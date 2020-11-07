const mongoose = require("mongoose");
const Organization = require("./organization");

const JobPosting = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Organization.modelName,
  },
  jobTitle: String,
  pay: String,
  code: String,
  description: String,
  qualifications: String,
  //TODO: Add skills
  //TODO: Add educational courses
});

module.exports = mongoose.model("JobPosting", JobPosting);
