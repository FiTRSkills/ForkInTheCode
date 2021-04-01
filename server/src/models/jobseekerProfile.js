const mongoose = require("mongoose");
const Organization = require("./organization");
const Skill = require("./skill");

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
  skills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Skill.modelName,
      autopopulate: true,
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
  return this;
};

/**
 * Edits a career entry on the profile with the given id.
 *
 * @param id The id of the career entry
 * @param values An object indicating the values that will be set, this should mirror the schema of careers
 * @returns {Promise<JobSeekerProfile>}
 */
JobSeekerProfile.methods.editCareer = async function (id, values) {
  if (values.organization) {
    let org = await Organization.findOneOrCreate(values.organization);
    values.organization = org._id;
  }
  await this.career.id(id).set(values);
  await this.save();
  return this;
};

/**
 * Remove an entry from the job seekers career record
 *
 * @param id The id of the career to remove
 * @returns {Promise<JobSeekerProfile>}
 */
JobSeekerProfile.methods.removeCareer = async function (id) {
  await this.career.pull(id);
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
  await this.education.push({
    degree: degree,
    major: major,
    gradDate: gradDate,
    organization: org._id,
  });
  await this.save();
  return this;
};

/**
 * Edits an education entry on the profile with the given id.
 *
 * @param id The id of the education entry
 * @param values An object indicating the values that will be set, this should mirror the schema of educations
 * @returns {Promise<JobSeekerProfile>}
 */
JobSeekerProfile.methods.editEducation = async function (id, values) {
  if (values.organization) {
    let org = await Organization.findOneOrCreate(values.organization);
    values.organization = org._id;
  }
  await this.education.id(id).set(values);
  await this.save();
  return this;
};

/**
 * Remove a degree from the education list of a job seeker
 *
 * @param id The id of the education to remove
 * @returns {Promise<JobSeekerProfile>}
 */
JobSeekerProfile.methods.removeEducation = async function (id) {
  await this.education.pull(id);
  await this.save();
  return this;
};

/**
 * Adds a new skill to the profile, associating it with a current skill if it exists.
 *
 * @param skills The id of the skill or list of ids of skills to add.
 * @returns {Promise<JobSeekerProfile>}
 */
JobSeekerProfile.methods.addSkills = async function (skills) {
  let skillEntries = await Skill.find({ _id: { $in: skills } });
  this.skills = this.skills.concat(skillEntries);
  await this.save();
  return this;
};

/**
 * Removes a skill from the profile by the given id.  This does not delete the skill from the system.
 *
 * @param id The id of the skill to remove from the profile
 * @returns {Promise<JobSeekerProfile>}
 */
JobSeekerProfile.methods.removeSkill = async function (id) {
  await this.skills.pull(id);
  await this.save();
  return this;
};

module.exports = mongoose.model("JobSeekerProfile", JobSeekerProfile);
