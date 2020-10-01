var express = require('express');
var router = express.Router();
var connectEnsureLogin = require('connect-ensure-login');
var passport = require('passport');

/**
* Routing to homepage
* @name GET /
* @param {string} chicken
*/
router.get('/', function(req, res, next) {
  connectEnsureLogin.ensureLoggedIn();
  res.render('index', { title: 'Express' });
});


/**
* Routing serving login form
* @name POST /login
* @property {string} path - Express path
* @param {callback} middleware - Express middleware
*/
router.post('/login', function(req, res, next) {
  	passport.authenticate('local', (err, user, info) => {
  		if (err){
  			return next(err);
  		}
  		if (!user) {
  			return res.redirect('/login');
  		}

  		req.logIn(user, function(err) {
  			if (err) {
  				returen next(err);
  			}
  			return res.redirect('/');
  		});
  	})(req, res, next);
});

module.exports = router;
