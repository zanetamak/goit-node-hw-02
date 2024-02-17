const express = require('express');
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require('../../controllers/contacts');

const validate = require('../api/validation');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res
      .status(200)
      .json({ status: 'success', code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (contact) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } });
    } else {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/', validate.contactValidator, async (req, res, next) => {
  try {
    const newContact = await addContact(req.body);
    res
      .status(201)
      .json({ status: 'success', code: 201, data: { newContact } });
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);
    if (contact) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, message: 'Contact deleted' });
    } else {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', validate.contactUpdateValidator, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactToEdit = await updateContact(contactId, req.body);
    if (contactToEdit) {
      return res.json({
        status: 'success',
        code: 200,
        data: { contactToEdit },
        message: 'Contact has been updated successfully',
      });
    } else {
      return res.json({ code: 404, message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
});

router.patch('/:contactId', validate.contactUpdateValidator, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;

    if (!favorite) {
      return res
        .status(400)
        .json({ message: 'Missing field "favorite"' });
    }

    const updatedContact = await updateStatusContact(contactId, { favorite });

    if (!updatedContact) {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not found' });
    }
    res
      .status(200)
      .json({ status: 'success', code: 200, data: { updatedContact } });
  } catch (error) {
    next(error);
  }
});



module.exports = router;
