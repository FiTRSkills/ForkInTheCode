const mongoose = require("mongoose");
const Organization = require("./organization");

/**
 * Profile information for job seekers.
 *
 * @type {Schema}
 */
const JobSeekerProfile = new mongoose.Schema({
  name: {
    first: {
      type: String,
      default: "",
    },
    last: {
      type: String,
      default: "",
    },
  },
  dateOfBirth: {
    type: Date,
    default: null,
  },
  career: [
    {
      jobTitle: String,
      startDate: Date,
      endDate: Date,
      organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Organization.modelName,
        autopopulate: true,
      },
    },
  ],
  education: [
    {
      degree: String,
      major: String,
      gradDate: Date,
      organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Organization.modelName,
        autopopulate: true,
      },
    },
  ],
});

/**
 * Adds a new entry to the careers this job seeker has undergone
 *
 * @returns {Promise<JobSeekerProfile>}
 */
JobSeekerProfile.methods.addCareer = async function (
  jobTitle,
  startDate,
  endDate,
  organization
) {
  let org = await Organization.findOneOrCreate(organization);
  this.career.push({
    jobTitle: jobTitle,
    startDate: startDate,
    endDate: endDate,
    organization: org._id,
  });
  await this.save();
};

/**
 * Remove an entry from the job seekers career record
 *
 * @param index The number of the career to remove
 * @returns {Promise<JobSeekerProfile>}
 */
JobSeekerProfile.methods.removeCareer = async function (index) {
  let result = this.career.splice(index, 1);
  if (result.length === 0)
    throw new RangeError("Career does not exist at that index");
  await this.save();
  return this;
};

/**
 * Adds one entry to the list of educations a job seeker has obtained
 *
 * @returns {Promise<JobSeekerProfile>}
 */
JobSeekerProfile.methods.addEducation = async function (
  degree,
  major,
  gradDate,
  organization
) {
  let org = await Organization.findOneOrCreate(organization);
  this.education.push({
    degree: degree,
    major: major,
    gradDate: gradDate,
    organization: org._id,
  });
  await this.save();
};

/**
 * Remove a degree from the education list of a job seeker
 *
 * @param index The number of degree to remove
 * @returns {Promise<JobSeekerProfile>}
 */
JobSeekerProfile.methods.removeEducation = async function (index) {
  let result = this.education.splice(index, 1);
  if (result.length === 0)
    throw new RangeError("Education does not exist at that index");
  await this.save();
  return this;
};

module.exports = mongoose.model("JobSeekerProfile", JobSeekerProfile);
