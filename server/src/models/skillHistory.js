const mongoose = require("mongoose");
const Skill = require("./skill");
const User = require("./user");

const SkillHistory = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User.modelName,
    autopopulate: true,
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Skill.modelName,
    autopopulate: true,
  },
  before: Skill.schema,
  after: Skill.schema,
});

SkillHistory.statics.logNew = async function (user, skill) {
  let log = new this({
    user: user,
    skill: skill,
    after: skill,
  });
  await log.save();
};

module.exports = mongoose.model("SkillHistory", SkillHistory);
