var express = require('express');
var router = express.Router();

/**
* Routing to homepage
* @name GET /
* @param {string} chicken
*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
* Routing serving login form
* @name POST /login
* @property {string} path - Express path
* @param {callback} middleware - Express middleware
*/
router.post('/login', passport.authenticate('local', {failureRedirect: '/login'}),
	function(req, res) {
  		res.redirect('/');	
});

module.exports = router;
