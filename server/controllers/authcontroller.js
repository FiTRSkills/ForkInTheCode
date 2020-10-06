var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/user");

var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
  res.send('index', { user : req.user });
};

// Go to registration page
userController.register = function(req, res) {
  res.send('register');
};

// Post registration
userController.doRegister = function(req, res) {
  User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
    if (err) {
      res.send(err);
    }

    passport.authenticate('local')(req, res, function () {
      res.status(200).send("Successfully created user");
    });
  });
};

// Go to login page
userController.login = function(req, res) {
  res.send('login');
};

// Post login
userController.doLogin = function(req, res) {
  passport.authenticate('local')(req, res, function () {
    res.send(req.user);
  });
};

// logout
userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = userController;