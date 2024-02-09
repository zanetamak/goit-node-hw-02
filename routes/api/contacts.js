const express = require('express');
const router = express.Router();
const Contacts = require('../../controllers/contacts');

const { updatedContactSchema, validateId } = require('./../api/validation');

router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    res.json({ status: 'success', code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  validateId(req.params.id);
  try {
    const contact = await Contacts.getContactById(req.params.id);
    if (contact) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not Found' });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'missing fields' });
  }

  try {
    const contact = await Contacts.addContact(req.body);
    res.status(201).json({ status: 'success', code: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  const validationError = await validateId(req.params.id);
  if (validationError) {
    return res
      .status(400)
      .json({ status: 'error', code: 400, message: validationError.details[0].message });
  }
  try {
    const contact = await Contacts.removeContact(req.params.id);
    if (contact) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } });
    } else {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not Found' });
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const contactId = req.params.id;
    const { error } = updatedContactSchema.validate({ name, email, phone });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message });
    }
    validateId(contactId);

    const updatedContact = await Contacts.updateContact(contactId, {
      name,
      email,
      phone,
    });
    if (!updatedContact) {
      return res
        .status(404)
        .json({ message: 'Nie znaleziono' });
    }

    res.json({
      status: 'success',
      code: 200,
      data: {
        updatedContact,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  res.json({ message: 'template message' });
});

module.exports = router;
