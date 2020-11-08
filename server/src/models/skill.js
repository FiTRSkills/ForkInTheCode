const mongoose = require("mongoose");

/**
 * Skill object that represents the concept of a single skill that could exist in
 * any given field.
 */
const Skill = new mongoose.Schema({
  name: String,
});

/**
 * Looks for an existing skill by the given name, but creates one
 * if it does not exist.
 *
 * @param name The name of the skill
 * @returns {Promise<Skill>}
 */
Skill.statics.findOneOrCreate = async function (name) {
  let skill = await this.findOne({ name: name }).exec();
  if (!skill) {
    skill = new this({ name: name });
    await skill.save();
  }
  return skill;
};

module.exports = mongoose.model("Skill", Skill);
