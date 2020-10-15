const mongoose = require("mongoose");

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
    await mongoose.connection.close();
  },
};
