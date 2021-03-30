/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const mongoose = require("../../../server/node_modules/mongoose");
const User = require("../../../server/src/models/user");

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  (async () => {
    try {
      await mongoose.connect(config.env.DB_CONN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: false,
        }
      );
    } catch (err) {
      console.log('error: ' + err)
    }
    console.log(mongoose.connection.readyState);
    })();
  on("task", {
    adduser: async () => {
      let user = new User({
        email: "hello@rit.edu",
        type: User.Type.JOB_SEEKER,
      });
      try {
        await User.register(user, "1234");
      } catch {
        // User already in database
      }
      return true;
    },
  }
  );
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
};
