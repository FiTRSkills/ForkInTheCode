const mongoose = require("mongoose");
const Skill = require("./skill");

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
 * Add skills that this course teaches by their IDs.
 *
 * @param skills A list of object IDs corresponding to the skills that should be added.
 * @returns {Promise<JobPosting>}
 */
Course.methods.addSkills = async function (skills) {
  let skillEntries = await Skill.find({ _id: { $in: skills } });
  this.skills = this.skills.concat(skillEntries);
  await this.save();
  return this;
};

module.exports = mongoose.model("Course", Course);
