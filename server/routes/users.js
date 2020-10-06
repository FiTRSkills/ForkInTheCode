var express = require('express');
var router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const debug = require("debug")("server:debug");
const error = require("debug")("server:error");

/**
* Get user listing
* @name GET /users/
* @property {string} path - Express path
* @property {function} callback - Register functionality
*/
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/", function(req, res, next){
  passport.authenticate("local", function(err, user, info){
    if(err) return next(err);
    if(!user) return res.status(401).send("Invalid credentials (redirect to login)")
    req.logIn(user, function(err){
      if(err) return next(err);
      return res.send("Successfully logged in");
    });
  })(req, res, next);
});
router.post("/new", function(req, res, next){
  const user = new User({username: req.param("username")});
  user.setPassword(req.param("password")).then(() => {
    return user.save();
  }).then(() => {
    res.send("Success");
  }).catch((e) => {
    error(e);
    res.status(500).send(e.message);
  });
})

module.exports = router;