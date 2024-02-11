const express = require('express');
const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact } = require('../../controllers/contacts');
const { contactSchema } = require('../api/validation');

router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json({ status: 'success', code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.id);
    if (contact) {
      return res.status(200).json({ status: 'success', code: 200, data: { contact } });
    }
    return res.status(404).json({ status: 'error', code: 404, message: 'Not Found' });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const contact = await addContact(req.body);
    res.status(201).json({ status: 'success', code: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const deletedContact = await removeContact(contactId);

    if (deletedContact) {
      return res.status(200).json({ status: 'success', code: 200, data: { deletedContact } });
    } else {
      return res.status(404).json({ status: 'error', code: 404, message: 'Nie znaleziono' });
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const contactId = req.params.id;
    const updatedContact = await updateContact(contactId, req.body);

    if (!updatedContact) {
      return res.status(404).json({ message: 'Nie znaleziono' });
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

router.patch('/:contactId', async (req, res, next) => {
  try {
    const { favorite } = req.body;
    if (favorite === undefined) {
      return res.status(400).json({ message: 'Brak pola "favorite"' });
    }
    const contactId = req.params.contactId;
    const updatedContact = await updateStatusContact(contactId, { favorite });

    if (!updatedContact) {
      return res.status(404).json({ message: 'Nie znaleziono' });
    }
    res.status(200).json({
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

module.exports = router;