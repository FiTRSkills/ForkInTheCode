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
  salary: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  benefits: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  amountOfJobs: {
    type: String,
    default: "",
  },
  jobTimeline: {
    type: String,
    default: "",
  },
  responsibilities: {
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
  let skillEntries = await Skill.find({ _id: { $in: skills } });
  this.skills = this.skills.concat(skillEntries);
  await this.save();
  return this;
};

/**
 * Removes a skill from the job posting by the given id.  This does not delete the skill from the system.
 *
 * @param id The id of the skill to remove from the job posting
 * @returns {Promise<JobPosting>}
 */
JobPosting.methods.removeSkill = async function (id) {
  // Handle both the auto-populated object and the non auto-populated one.
  this.skills = this.skills.filter((skill) => {
    if (skill._id) return !skill._id.equals(id);
    return !skill.equals(id);
  });
  await this.save();
  return this;
};

module.exports = mongoose.model("JobPosting", JobPosting);
