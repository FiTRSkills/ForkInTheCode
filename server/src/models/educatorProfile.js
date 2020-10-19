const mongoose = require("mongoose");

/**
 * Profile information for educators.
 *
 * @type {Schema}
 */
const EducatorProfile = new mongoose.Schema({

});

module.exports = mongoose.model("EducatorProfile", EducatorProfile);