const mongoose = require("mongoose");
mongoose.plugin(require("mongoose-autopopulate"));

module.exports = {
  connectDB: async () => {
    await mongoose.connect(
      process.env.MONGO_URL,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      }
    );
  },
  disconnectDB: async () => {
    // Start with a fresh database for every test
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  },
};
