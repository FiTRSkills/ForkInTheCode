var express = require('express');
var router = express.Router();
var auth = require("../controllers/authcontroller.js");

// restrict index for logged in user only
router.get('/', auth.home);

// route to register page
router.get('/register', auth.register);

// route for register action
router.post('/register', auth.doRegister);

// route to get login page
router.get('/login', auth.login);

/**
* Routing serving login form
* @name POST /login
* @property {string} path - Express path
* @param {callback} middleware - Express middleware
*/
router.post('/login', auth.doLogin);

// route for logout action
router.get('/logout', auth.logout);

module.exports = router;
