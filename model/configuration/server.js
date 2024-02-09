const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.DB_HOST;

const db = mongoose.connect(DB_URL, {
  useUnifiedTopology: true,
  useFindAndModify: false,
});

moongoose.connection.on
  .then(() => {
    app.listen(PORT, function () {
      console.log(`Database connection successful`);
    });
  })
  .catch(err =>
    console.log(`Server not running. Error message: ${err.message}`),
  );
