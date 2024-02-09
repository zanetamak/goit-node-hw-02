const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.DB_HOST;

const db = mongoose.connect(DB_URL, {
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection
  .then(() => {
    app.listen(DB_URL, function () {
      console.log(`Database connection successful`);
    });
  })
  .catch((err) => {
    console.log(`Server not run. Error: ${err.message}`);
  });