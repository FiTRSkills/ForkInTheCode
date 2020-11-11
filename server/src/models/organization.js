const mongoose = require("mongoose");

/**
 * Organizations that accounts can belong to.  These can be for educators or employers.
 *
 * @type {Schema}
 */
const Organization = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  location: String,
  contact: {
    address: String,
    email: String,
    phone: String,
  },
});

/**
 * Looks for an existing organization by the given name, but creates one
 * if it does not exist.
 *
 * @param name The name of the organization
 * @returns {Promise<Organization>}
 */
Organization.statics.findOneOrCreate = async function (name) {
  let org = await this.findOne({ name: name }).exec();
  if (!org) {
    org = new this({ name: name });
    await org.save();
  }
  return org;
};

module.exports = mongoose.model("Organization", Organization);
