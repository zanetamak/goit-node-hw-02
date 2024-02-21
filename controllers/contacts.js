const { Contact } = require('../contacts.schema');

const listContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const detectedContact = await Contact.findOne({ _id: contactId });
    return detectedContact;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};
const removeContact = async (contactId) => {
  try {
    const removedContact = await Contact.findByIdAndDelete({ _id: contactId });
    return removedContact;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

const addContact = async (body) => {
  try {
    const newContact = await Contact.create(body);
    return newContact;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      { _id: contactId },
      body,
      { new: true, runValidators: true }
    );
    return updatedContact;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

const updateStatusContact = async (contactId, body) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      { _id: contactId },
      { favorite: body.favorite },
      { new: true }
    );
    return updatedContact;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
