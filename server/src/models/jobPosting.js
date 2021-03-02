const mongoose = require("mongoose");
const Organization = require("./organization");
const Skill = require("./skill");

/**
 * Defines a job posting on the website created by an organization that is visible to
 * job seekers.
 */
const JobPosting = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Organization.modelName,
    autopopulate: true,
  },
  jobTitle: {
    type: String,
    default: "",
  },
  zipCode: {
    type: String,
    default: "",
  },
  pay: {
    type: String,
    default: "",
  },
  code: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  qualifications: {
    type: String,
    default: "",
  },
  skills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Skill.modelName,
      autopopulate: true,
    },
  ],
  //TODO: Add educational courses
});

/**
 * Finds a single job posting based on the ID provided.
 *
 * @param id The id of the job posting to retrieve.
 * @returns {Promise<JobPosting>}
 */
JobPosting.statics.getJobPosting = async function (id) {
  return await this.findById(id).exec();
};

/**
 * Search all job postings and find the ones that match the given filters.
 * All filters should be provided in an object to the search function.
 *
 * @param zipCode Filter the job posting by the zip code it is located in.
 * @param skills Filter the job posting by skills that the job is looking for.
 * @returns {Promise<JobPosting[]>}
 */
JobPosting.statics.search = async function ({ zipCode, skills }) {
  let filter = {};
  if (zipCode && zipCode.length > 0) filter.zipCode = zipCode;
  if (skills && skills.length > 0) filter.skills = { $all: skills };

  return await this.find(filter).exec();
};

/**
 * Set the organization for a given job posting by the organization name.  If the organization
 * is not found in the system, a new one will be created.
 *
 * @param organization The name of the organization to set tis JobPosting to.
 * @returns {Promise<JobPosting>}
 */
JobPosting.methods.setOrganization = async function (organization) {
  let org = await Organization.findOneOrCreate(organization);
  this.organization = org._id;
  await this.save();
  return this;
};

/**
 * Add multiple required skills to this job posting.  Each skill will be a single
 * string and if that skill is not found in the system, a new one will be created.
 *
 * @param skills A list of object IDs corresponding to the skills that should be added.
 * @returns {Promise<JobPosting>}
 */
JobPosting.methods.addSkills = async function (skills) {
  for (let skill of skills) {
    let skillEntry = await Skill.findOneOrCreate(skill);
    await this.skills.push(skillEntry);
  }
  await this.save();
  return this;
};

module.exports = mongoose.model("JobPosting", JobPosting);
