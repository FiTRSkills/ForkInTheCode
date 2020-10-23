const mongoose = require("mongoose");
const Organization = require("./organization");

/**
 * Profile information for employers.
 *
 * @type {Schema}
 */
const EmployerProfile = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Organization.modelName,
  },
});

EmployerProfile.statics.findAndPopulateById = function (id) {
  return this.findById(id).populate("organization").exec();
};

EmployerProfile.methods.setOrganization = async function (name) {
  let org = await Organization.findOneOrCreate(name);
  this.organization = org._id;
  await this.save();
  // Mongoose doesn't like to populate after the query is executed with the document method.
  return await this.constructor.populate(this, "organization");
};

module.exports = mongoose.model("EmployerProfile", EmployerProfile);
