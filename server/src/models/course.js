const mongoose = require("mongoose");
const Skill = require("./skill");
const Organization = require("./organization");

/**
 * A course as defined by an educator that can be referenced by job postings and be found
 * through skills.  The course has specified skills that it can provide as well as all
 * information needed to ensure that a job seeker can learn those skills.
 */
const Course = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  description: {
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
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Organization.modelName,
    autopopulate: true,
  },
  location: {
    type: String,
    default: "",
  },
  contact: {
    type: String,
    default: "",
  },
  period: {
    type: String,
    default: "",
  },
  times: {
    type: String,
    default: "",
  },
  moneyCost: {
    type: String,
    default: "",
  },
  timeCost: {
    type: String,
    default: "",
  },
  requiredEquipment: {
    type: String,
    default: "",
  },
});

/**
 * Finds all courses that teach the provided skill ordered by number of
 * jobs recommending that course.
 *
 * @param skill The ID of the skill to search for
 * @returns {Promise<*>}
 */
Course.statics.findAllBySkill = async function (skill) {
  return await this.find({ skills: skill }).exec();
  // TODO order by job recommendations
};

/**
 * Sets the organization or creates a new one if the name is not found.
 *
 * @param name The name of the organization to match or create
 * @returns {Promise<Course>}
 */
Course.methods.setOrganization = async function (name) {
  let org = await Organization.findOneOrCreate(name);
  this.organization = org._id;
  await this.save();
  // Mongoose doesn't like to populate after the query is executed with the document method.
  return await this.constructor.populate(this, "organization");
};

/**
 * Add skills that this course teaches by their IDs.
 *
 * @param skills A list of object IDs corresponding to the skills that should be added.
 * @returns {Promise<Course>}
 */
Course.methods.addSkills = async function (skills) {
  let skillEntries = await Skill.find({ _id: { $in: skills } });
  this.skills = this.skills.concat(skillEntries);
  await this.save();
  return this;
};

/**
 * Removes a skill from the course by the given id.  This does not delete the skill from the system.
 *
 * @param id The id of the skill to remove from the course
 * @returns {Promise<Course>}
 */
Course.methods.removeSkill = async function (id) {
  // Handle both the auto-populated object and the non auto-populated one.
  this.skills = this.skills.filter((skill) => {
    if (skill._id) return !skill._id.equals(id);
    return !skill.equals(id);
  });
  await this.save();
  return this;
};

module.exports = mongoose.model("Course", Course);
