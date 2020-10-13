var express = require("express");
var router = express.Router();
var auth = require("../controllers/authcontroller.js");

/**
 * Routing serving registration
 * @name POST /register
 * @property {string} path - Express path
 * @property {function} auth.doRegister - Register functionality
 */
router.post("/register", auth.doRegister);

/**
 * Routing serving login
 * @name POST /login
 * @property {string} path - Express path
 * @property {function} auth.doLogin - Login functionality
 */
router.post("/login", auth.doLogin);

/**
 * Routing serving logout
 * @name GET /logout
 * @property {string} path - Express path
 * @property {function} auth.logout - Logout functionality
 */
router.get("/logout", auth.logout);

module.exports = router;
