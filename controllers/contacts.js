const { Contact } = require('../contacts.schema')

const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    return await Contact.findById(contactId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    const result = await Contact.findByIdAndDelete(contactId);
    return Boolean(result); 
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const addContact = async (body) => {
  try {
    const newContact = await Contact.create(body);
    return newContact;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { $set: body },
      { new: true, runValidators: true }
    );
    return updatedContact;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateStatusContact = async (contactId, favorite) => {
  try {
    const update = { favorite };
    const updatedContact = await Contact.findByIdAndUpdate(contactId, update, {
      new: true,
    });
    return updatedContact;
  } catch (error) {
    console.error(error);
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