//var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

UserDetail.plugin(passportLocalMongoose);
var userDetails = mongoose.model('userInfo', UserDetail, 'userInfo')

passport.use(userDetails.createStrategy());

passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());


module.exports = passport;