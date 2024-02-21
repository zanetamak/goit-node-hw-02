const { Contact } = require('../models/contacts.schema');

const listContacts = async (ownerId) => {
  try {
    const contacts = await Contact.find({owner: ownerId });
    return contacts;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const getContactById = async (contactId, ownerId) => {
  try {
    const detectedContact = await Contact.findOne({ _id: contactId, owner: ownerId });
    return detectedContact;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
const removeContact = async (contactId, ownerId) => {
  try {
    const removedContact = await Contact.findByIdAndDelete({ _id: contactId, owner: ownerId});
    return removedContact;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const addContact = async (body, ownerId) => {
  try {
    const newContact = await Contact.create({ ...body, owner: ownerId });
    return newContact;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const updateContact = async (contactId, body, ownerId) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      { _id: contactId, owner: ownerId },
      body,
      { new: true, runValidators: true }
    );
    return updatedContact;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const updateStatusContact = async (contactId, body, ownerId) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      { _id: contactId, owner: ownerId },
      { favorite: body.favorite },
      { new: true }
    );
    return updatedContact;
  } catch (error) {
    console.error('Error:', error);
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
