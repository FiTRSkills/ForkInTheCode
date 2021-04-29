const Skill = require("../models/skill");
const JobPosting = require("../models/jobPosting");
const Course = require("../models/course");
const mongoose = require("mongoose");

const search = {};

/**
 * Finds all job postings at the zip code, and returns a sorted list of
 * skills by number of job postings with that skill.
 *
 * @param zipCode The zip code to search in.
 * @returns {Promise<void>}
 */
search.findSkillsByZip = async function (zipCode) {
  return await JobPosting.aggregate([
    {
      // Filter out the job postings to only the ones we are interested in
      $match: {
        zipCode: zipCode,
      },
    },
    {
      // Create a new entry for every job / skill pair
      $unwind: "$skills",
    },
    {
      // Map each pair to it's proper skill rather than just it's ID
      $lookup: {
        from: Skill.collection.collectionName,
        localField: "skills",
        foreignField: "_id",
        as: "skill",
      },
    },
    {
      // Lookup returns an array, unwind it so we are working with plain objects
      $unwind: "$skill",
    },
    {
      // Group all entries by skills so we have 1 entry per skill
      // At this point, we can also sum up all of the job postings associated with that skill
      $group: {
        _id: "$skill",
        weight: { $sum: 1 },
      },
    },
    {
      // Sort by the calculated weight of each item
      $sort: { weight: -1 },
    },
    {
      $addFields: {
        "_id.numJobs": "$weight",
      },
    },
    {
      // We only care about the skills, replace root with the skills from the group
      $replaceRoot: {
        newRoot: "$_id",
      },
    },
  ]).exec();
};

/**
 * Finds all courses that teach the provided skill ordered by number of
 * jobs recommending that course.
 *
 * @param skills The ID or list of IDs of the skills to search for
 * @param partialName A partial search that should match the course name
 * @returns {Promise<*>}
 */
search.findCoursesBySkills = async function (skills, partialName = "") {
  const skillQuery = Array.isArray(skills)
    ? {
        $elemMatch: {
          $in: skills.map(
            (skill) =>
              mongoose.Types.ObjectId(skill._id) ||
              mongoose.Types.ObjectId(skill)
          ),
        },
      }
    : skills;
  const results = await Course.aggregate([
    {
      // Filter out the courses to only the ones we are interested in
      $match: {
        name: { $regex: partialName, $options: "i" },
        skills: skillQuery,
      },
    },
    {
      // Map all job postings that recommend this course as an array
      $lookup: {
        from: JobPosting.collection.collectionName,
        localField: "_id",
        foreignField: "courses",
        as: "jobPostings",
      },
    },
    {
      // Convert the mapped array to a number we can use to sort
      $addFields: {
        jobPostings: { $size: "$jobPostings" },
      },
    },
    {
      $sort: { jobPostings: -1 },
    },
  ]).exec();
  for (let course of results) {
    await Course.populate(course, "organization");
    await Course.populate(course, "skills");
  }
  return results;
};

module.exports = search;
