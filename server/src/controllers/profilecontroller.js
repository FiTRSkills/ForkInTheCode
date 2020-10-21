/** Module providing user implementation for routes
 * @module controllers/profilecontroller
 */

const mongoose = require("mongoose");
const passport = require("passport");

const profileController = {};

profileController.getProfile = function (req, res) {
  res.status(200).send('profile')
};

module.exports = profileController;