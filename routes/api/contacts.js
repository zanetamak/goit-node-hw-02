const express = require('express');
const router = express.Router();
const Contact = require('../../contacts.schema');
const { updateStatusContact } = require('../../controllers/contacts')


router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.json({ status: 'success', code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (contact) {
      return res.status(200).json({ status: 'success', code: 200, data: { contact } });
    }
    return res.status(404).json({ status: 'error', code: 404, message: 'Not Found' });
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
    const contact = await Contact.create(req.body);
    res.status(201).json({ status: 'success', code: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (contact) {
      return res.status(200).json({ status: 'success', code: 200, data: { contact } });
    } else {
      return res.status(404).json({ status: 'error', code: 404, message: 'Not Found' });
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const contactId = req.params.id;

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { name, email, phone },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: 'not found' });
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
      return res.status(400).json({ message: 'missing field favorite' });
    }
    const contactId = req.params.contactId;
    const updatedContact = await updateStatusContact(contactId, { favorite });

    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' });
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
