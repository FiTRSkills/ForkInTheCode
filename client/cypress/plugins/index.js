/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)


const mongoose = require("../../../server/node_modules/mongoose");
const User = require("../../../server/src/models/user");
const Organization = require("../../../server/src/models/organization");
const Skill = require("../../../server/src/models/skill");
const JobPosting = require("../../../server/src/models/jobPosting");
const Course = require("../../../server/src/models/course");
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  (async () => {
    try {
      await mongoose.connect(config.env.DB_CONN, {
        auth: {
          user: config.env.DB_USER,
          password: config.env.DB_PW,
        },
          useNewUrlParser: true,
          useUnifiedTopology: true,
          retryWrites: false,
        }
      );
    } catch (err) {
      console.log('error: ' + err)
    }
  })();

  (async function () {
    // Create users

    let jobSeekers = [
      new User({
        email: "js1@g.com",
        type: User.Type.JOB_SEEKER,
      }),
      new User({
        email: "js2@g.com",
        type: User.Type.JOB_SEEKER,
      }),
      new User({
        email: "js3@g.com",
        type: User.Type.JOB_SEEKER,
      }),
    ];

    let employers = [
      new User({
        email: "emp1@g.com",
        type: User.Type.EMPLOYER,
      }),
      new User({
        email: "emp2@g.com",
        type: User.Type.EMPLOYER,
      }),
      new User({
        email: "em32@g.com",
        type: User.Type.EMPLOYER,
      }),
    ];

    let educators = [
      new User({
        email: "edj1@g.com",
        type: User.Type.EDUCATOR,
      }),
      new User({
        email: "edj2@g.com",
        type: User.Type.EDUCATOR,
      }),
      new User({
        email: "edj3@g.com",
        type: User.Type.EDUCATOR,
      }),
    ];

    async function register(users) {
      for (let i = 0; i < users.length; i++) {
        try {
          await User.register(users[i], "pass");
        } catch {
          console.log("Skipping user: " + users[i].email);
          users[i] = await User.findOne({ email: users[i].email }).exec();
        }
      }
    }
    await register(jobSeekers);
    await register(employers);
    await register(educators);

    // Organizations
    let organizations = [
      new Organization({
        name: "Organization 1",
        location: "Online",
        contact: {
          email: "org1@g.com",
        },
      }),
      new Organization({
        name: "Organization 2",
        location: "United States",
        contact: {
          address: "1 Test Dr.",
          email: "org2@g.com",
        },
      }),
      new Organization({
        name: "Organization 3",
        location: "Online",
        contact: {
          email: "org3@g.com",
          phone: "000-000-0000",
        },
      }),
    ];
    for (let i = 0; i < organizations.length; i++) {
      try {
        await organizations[i].save();
      } catch {
        console.log("Skipping organization: " + organizations[i].name);
        organizations[i] = await Organization.findOne({
          name: organizations[i].name,
        }).exec();
      }
    }

    await (await employers[0].getProfile()).setOrganization(
      organizations[0].name
    );
    await (await educators[0].getProfile()).setOrganization(
      organizations[0].name
    );
    await (await employers[1].getProfile()).setOrganization(
      organizations[1].name
    );
    await (await educators[1].getProfile()).setOrganization(
      organizations[2].name
    );

    // Skills
    let skills = [
      new Skill({
        name: "Skill1",
        description: "Short Description",
      }),
      new Skill({
        name: "Skill2",
        description:
          "Medium Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis urna diam. Mauris luctus ultricies placerat. Etiam lectus dui, feugiat.",
      }),
      new Skill({
        name: "Skill3",
        description: "Short Description",
      }),
      new Skill({
        name: "Skill4",
        description:
          "Long Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dui turpis, commodo sit amet pharetra ac, sagittis ut velit. Duis sit amet lorem lacinia, sollicitudin erat vitae, pulvinar diam. Donec luctus ex efficitur libero mollis posuere. Ut finibus ligula et tortor interdum, quis condimentum sem bibendum. Aliquam erat volutpat. Donec pulvinar ultricies ex maximus fringilla. Donec pretium feugiat metus, sed.",
      }),
      new Skill({
        name: "Skill5",
        description: "Short Description",
      }),
      new Skill({
        name: "Skill6",
        description: "Short Description",
      }),
      new Skill({
        name: "Skill7",
        description:
          "XLong Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non lorem gravida, suscipit velit eget, varius lacus. Proin augue tellus, rhoncus vitae scelerisque vitae, interdum viverra justo. Ut maximus felis eget erat sollicitudin egestas. Donec blandit sapien nulla, ac suscipit orci varius vel. Fusce facilisis lectus ut ante scelerisque commodo. Mauris nec ex non justo lobortis maximus sit amet quis erat. Pellentesque eu vestibulum leo, in sollicitudin tortor. Proin a volutpat nisl, eget blandit massa. Fusce pretium, elit a aliquam tempus, dui ipsum malesuada nisl, ut faucibus risus turpis ut nunc. In laoreet libero vel mi finibus, ut placerat nisi malesuada. Pellentesque velit elit, eleifend at ipsum pulvinar, blandit laoreet urna. Suspendisse vehicula convallis libero, elementum elementum sapien vulputate consectetur. Fusce eleifend quam at sem euismod, quis vulputate turpis mattis. Curabitur nunc metus, congue sit amet ante nec, imperdiet pretium nisl.\n" +
          "\n" +
          "Integer accumsan sapien bibendum erat condimentum, vel pretium ligula congue. Ut tellus nisl, laoreet vitae elit ut, varius tempor sapien. Phasellus consequat odio id volutpat feugiat. Nulla facilisi. Aliquam facilisis fringilla vehicula. Nulla luctus nisi in eros vestibulum, non commodo ex malesuada. Maecenas egestas id risus vel mollis. Proin egestas purus enim, ut facilisis sem congue ac. Quisque varius augue porttitor, posuere sapien non, tincidunt elit. Proin leo enim, dapibus sed varius vel, condimentum eu massa. Pellentesque molestie molestie tempus. Etiam suscipit sollicitudin massa, eu varius lorem lobortis vel. Quisque tincidunt, diam fringilla interdum iaculis, nisi augue molestie augue, et semper ligula enim vel magna. Donec fringilla sollicitudin sodales. Praesent sit amet elementum velit. Quisque rutrum massa mauris, sit amet cursus dolor dictum quis.",
      }),
      new Skill({
        name: "Skill8",
        description: "Short Description",
      }),
    ];
    for (let skill of skills) await skill.save();

    //Job Postings
    let jobPostings = [
      new JobPosting({
        organization: organizations[0]._id,
        jobTitle: "Job 1",
        zipCode: "12345",
        pay: "$100",
        code: "aeiou",
        description: "Short Description",
        qualifications: "A, B, C, D",
        skills: [skills[0]._id, skills[1]._id, skills[2]._id],
      }),
      new JobPosting({
        organization: organizations[0]._id,
        jobTitle: "Job 2",
        zipCode: "12345",
        pay: "$50",
        code: "aeiouy",
        description:
          "Long Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dui turpis, commodo sit amet pharetra ac, sagittis ut velit. Duis sit amet lorem lacinia, sollicitudin erat vitae, pulvinar diam. Donec luctus ex efficitur libero mollis posuere. Ut finibus ligula et tortor interdum, quis condimentum sem bibendum. Aliquam erat volutpat. Donec pulvinar ultricies ex maximus fringilla. Donec pretium feugiat metus, sed.",
        qualifications: "A, B, C, D, E",
        skills: [skills[1]._id, skills[2]._id, skills[3]._id],
      }),
      new JobPosting({
        organization: organizations[0]._id,
        jobTitle: "Job 3",
        zipCode: "12345",
        pay: "$75",
        code: "lmnop",
        description:
          "Medium Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis urna diam. Mauris luctus ultricies placerat. Etiam lectus dui, feugiat.",
        qualifications: "A, B",
        skills: [skills[2]._id, skills[4]._id, skills[6]._id],
      }),
      new JobPosting({
        organization: organizations[0]._id,
        jobTitle: "Job 4",
        zipCode: "54321",
        skills: [skills[4]._id, skills[5]._id, skills[6]._id],
      }),
      new JobPosting({
        organization: organizations[1]._id,
        jobTitle: "Job 5",
        zipCode: "54321",
        skills: [skills[1]._id, skills[3]._id, skills[5]._id],
      }),
      new JobPosting({
        organization: organizations[1]._id,
        jobTitle: "Job 6",
        zipCode: "54321",
        skills: [skills[2]._id],
      }),
      new JobPosting({
        organization: organizations[2]._id,
        jobTitle: "Job 7",
        zipCode: "54321",
        skills: [skills[7]._id],
      }),
      new JobPosting({
        organization: organizations[2]._id,
        jobTitle: "Job 8",
        zipCode: "98765",
        skills: [skills[5]._id],
      }),
    ];
    for (let jobPosting of jobPostings) await jobPosting.save();

    // Courses
    let courses = [
      new Course({
        name: "Course 1",
        description: "Short Description",
        skills: [skills[0]._id, skills[1]._id, skills[2]._id],
        organization: organizations[0]._id,
        location: "Online",
        contact: "test@test.com",
        period: "12 weeks",
        times: "MWF",
        moneyCost: "$5000",
        timeCost: "12 weeks",
        requiredEquipment: "n/a",
      }),
      new Course({
        name: "Course 2",
        description:
          "Medium Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis urna diam. Mauris luctus ultricies placerat. Etiam lectus dui, feugiat.",
        skills: [skills[2]._id, skills[4]._id, skills[6]._id],
        organization: organizations[0]._id,
        location: "Place",
        contact: "test@test.com",
        period: "6 weeks",
        times: "MWF",
        moneyCost: "$200",
        timeCost: "6 weeks",
        requiredEquipment: "n/a",
      }),
      new Course({
        name: "Course 3",
        description:
          "Long Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dui turpis, commodo sit amet pharetra ac, sagittis ut velit. Duis sit amet lorem lacinia, sollicitudin erat vitae, pulvinar diam. Donec luctus ex efficitur libero mollis posuere. Ut finibus ligula et tortor interdum, quis condimentum sem bibendum. Aliquam erat volutpat. Donec pulvinar ultricies ex maximus fringilla. Donec pretium feugiat metus, sed.",
        skills: [skills[1]._id, skills[3]._id, skills[5]._id],
        organization: organizations[0]._id,
        location: "Online",
        contact: "test@test.com",
        period: "3 months",
        times: "TuTh",
        moneyCost: "$800",
        timeCost: "3 months",
        requiredEquipment: "n/a",
      }),
      new Course({
        name: "Course 4",
        description: "Short Description",
        skills: [skills[5]._id, skills[6]._id],
        organization: organizations[1]._id,
      }),
      new Course({
        name: "Course 5",
        description: "Short Description",
        skills: [skills[2]._id],
        organization: organizations[1]._id,
      }),
      new Course({
        name: "Course 6",
        description: "Short Description",
        skills: [skills[3]._id, skills[4]._id],
        organization: organizations[2]._id,
      }),
      new Course({
        name: "Course 7",
        description: "Short Description",
        skills: [
          skills[1]._id,
          skills[2]._id,
          skills[3]._id,
          skills[4]._id,
          skills[5]._id,
          skills[6]._id,
        ],
        organization: organizations[2]._id,
      }),
      new Course({
        name: "Course 8",
        description: "Short Description",
        skills: [skills[7]._id],
        organization: organizations[2]._id,
      }),
    ];
    for (let course of courses) await course.save();

    mongoose.connection.close();
  })();

  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
};