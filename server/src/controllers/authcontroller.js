/** Module providing user implementation for routes
 * @module controllers/authcontroller
 */
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../models/user");

const userController = {};

/**
 * functionality for registration
 * @name doRegister
 * @function
 * @alias module:/controllers/authcontroller
 * @property {request} request - contains username and password
 * @returns {string} response - whether or not registration was completed
 */
userController.doRegister = function (req, res) {
  if (req.body.usertype == "JobSeekerProfile") {
    User.register(
      new User({ email: req.body.email, type: req.body.usertype }),
      req.body.password,
      function (err, user) {
        if (err) {
          res.status(400).send(err);
          return;
        }

        passport.authenticate("local")(req, res, function () {
          res.status(200).send("Successfully created Job Seeker user");
        });
      }
    );
  } else if (req.body.usertype == "EmployerProfile") {
    User.register(
      new User({ email: req.body.email, type: req.body.usertype }),
      req.body.password,
      async function (err, user) {
        if (err) {
          res.status(400).send(err);
          return;
        }
        let profile = await user.getProfile();
        await profile.setOrganization(req.body.organization);
        passport.authenticate("local")(req, res, function () {
          res.status(200).send("Successfully created Employer user");
        });
      }
    );
  } else if (req.body.usertype == "EducatorProfile") {
    User.register(
      new User({ email: req.body.email, type: req.body.usertype }),
      req.body.password,
      async function (err, user) {
        if (err) {
          res.status(400).send(err);
          return;
        }
        let profile = await user.getProfile();
        await profile.setOrganization(req.body.organization);
        passport.authenticate("local")(req, res, function () {
          res.status(200).send("Successfully created Educator user");
        });
      }
    );
  } else {
    res.status(400).send("Invalid usertype");
  }
};

/**
 * functionality for login
 * @name doLogin
 * @function
 * @alias module:/controllers/authcontroller
 * @property {request} request - contains username and password
 * @returns {string} response - the user on successful login
 */
userController.doLogin = function (req, res) {
  passport.authenticate("local")(req, res, function () {
    res.send(req.user.user_info);
  });
};

/**
 * functionality for logout
 * @name logout
 * @function
 * @alias module:/controllers/authcontroller
 * @property {request} request - request to server
 * @returns {string} response - the session is closed for the user
 */
userController.logout = function (req, res) {
  req.logout();
  res.status(200).send("Successfully logged out");
};

module.exports = userController;
