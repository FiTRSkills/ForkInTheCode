var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/user");

var userController = {};

/**
 * functionality for registration
 * @name userController.doRegister
 * @property {request} request - contains username and password
 * @returns {string} response - whether or not registration was completed
 */
userController.doRegister = function (req, res) {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function (err, user) {
      if (err) {
        res.send(err);
        return;
      }

      passport.authenticate("local")(req, res, function () {
        res.status(200).send("Successfully created user");
      });
    }
  );
};

/**
 * functionality for login
 * @name UserController.doLogin
 * @property {request} request - contains username and password
 * @returns {string} response - the user on successful login
 */
userController.doLogin = function (req, res) {
  passport.authenticate("local")(req, res, function () {
    res.send(req.user.username);
  });
};

/**
 * functionality for logout
 * @name UserController.logout
 * @property {request} request - request to server
 * @returns {string} response - the session is closed for the user
 */
userController.logout = function (req, res) {
  req.logout();
  res.status(200).send("Successfully logged out");
};

module.exports = userController;
