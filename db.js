const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.DB_HOST;

const dbConnect = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connection successful");
  } catch (error) {
    console.error("Connection error:", error.message);
    process.exit(1);
  }
};

module.exports = dbConnect;