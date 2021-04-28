/** Module providing skill implementation for routes
 * @module controllers/skillcontroller
 */

const Skill = require("../models/skill");
const SkillHistory = require("../models/skillHistory");
const Search = require("../services/search");
const Course = require("../models/course");
const User = require("../models/user");

const skillController = {};

/**
 * functionality for getting all skills
 * @name skills
 * @function
 * @alias module:/controllers/skillcontroller
 * @property {request} request - none
 * @returns {string} response - all skills
 */
skillController.skills = async function (req, res) {
  let skills = await Skill.find();
  if (skills === undefined || skills.length == 0) {
    res.status(406).send("no skills exist");
    return;
  }
  res.status(200).send(skills);
};

/**
 * functionality for getting skills within a zipcode and their
 * number of jobs
 * @name skillsSearch
 * @function
 * @alias module:/controllers/skillcontroller
 * @property {request} request - contains zipcode
 * @returns {string} response - skills and number of jobs skills are in
 */
skillController.skillsSearch = async function (req, res) {
  let results = undefined;
  try {
    results = await Search.findSkillsByZip(req.query.zipCode);
  } catch (error) {
    res.status(406).send("no skills exist");
    return;
  }
  if (results === undefined || results.length == 0) {
    res.status(406).send("no skills exist");
    return;
  }
  res.status(200).send(results);
};

/**
 * functionality for getting a specific skill
 * @name skills
 * @function
 * @alias module:/controllers/skillcontroller
 * @property {request} request - skill id
 * @returns {string} response - skill information and related courses
 */
skillController.getSkill = async function (req, res) {
  let skill = "";
  try {
    skill = await Skill.findOne({ _id: req.query.id });
  } catch (CastError) {
    res.status(406).send("skill does not exist");
    return;
  }
  // get courses associated with the skill
  let courses = await Course.findAllBySkill(skill._id);
  let skill_info = {
    skill: skill,
    courses: courses,
  };
  res.status(200).send(skill_info);
};

/**
 * functionality for creating a specific skill
 * @name skills
 * @function
 * @alias module:/controllers/skillcontroller
 * @property {request} request - skill name, skill description
 * @returns {string} response - success and skill _id
 */
skillController.createSkill = async function (req, res) {
  // only employers and educators can create skills
  if (
    req.user.type == User.Type.EMPLOYER ||
    req.user.type == User.Type.EDUCATOR
  ) {
    try {
      let skill = await Skill.findOne({ name: req.body.name }).exec();
      // if the skill already exists in the database
      if (skill) {
        res.status(400).send("Skill with that name already exists.");
        return;
      }
      skill = new Skill({
        name: req.body.name,
        description: req.body.description,
      });
      await skill.save();
      await SkillHistory.logNew(req.user, skill);
      res.status(200).send({ _id: skill._id });
    } catch (error) {
      res.status(400).send("Error on skill creation.");
      return;
    }
  } else {
    res.status(400).send("Invalid usertype.");
  }
};

module.exports = skillController;
