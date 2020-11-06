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
  await this.career.push({
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
 * @param id The id of the career to remove
 * @returns {Promise<JobSeekerProfile>}
 */
JobSeekerProfile.methods.removeCareer = async function (id) {
  await this.career.pull({ _id: id });
  await this.save();
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
  await this.education.push({
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
 * @param id The id of the education to remove
 * @returns {Promise<JobSeekerProfile>}
 */
JobSeekerProfile.methods.removeEducation = async function (id) {
  await this.education.pull({ _id: id });
  await this.save();
};

module.exports = mongoose.model("JobSeekerProfile", JobSeekerProfile);
