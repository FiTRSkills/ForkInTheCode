const mongoose = require("mongoose");
const Organization = require("./organization");

/**
 * Profile information for educators.
 *
 * @type {Schema}
 */
const EducatorProfile = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Organization.modelName,
    autopopulate: true,
  },
});

/**
 * Sets the organization or creates a new one if the name is not found.
 *
 * @param name The name of the organization to match or create
 * @returns {Promise<EducatorProfile>}
 */
EducatorProfile.methods.setOrganization = async function (name) {
  let org = await Organization.findOneOrCreate(name);
  this.organization = org._id;
  await this.save();
  // Mongoose doesn't like to populate after the query is executed with the document method.
  return await this.constructor.populate(this, "organization");
};

module.exports = mongoose.model("EducatorProfile", EducatorProfile);
