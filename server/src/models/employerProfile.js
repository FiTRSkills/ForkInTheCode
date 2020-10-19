const mongoose = require("mongoose");

/**
 * Profile information for employers.
 *
 * @type {Schema}
 */
const EmployerProfile = new mongoose.Schema({

});

module.exports = mongoose.model("EmployerProfile", EmployerProfile);