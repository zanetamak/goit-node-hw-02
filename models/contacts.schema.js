const { mongoose, Schema } = require('mongoose');

const contacts = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    }
});

const Contact = mongoose.model("contact", contacts);

module.exports = { Contact };

