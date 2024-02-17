const Joi = require('joi');

const baseContactSchema = {
  name: Joi.string().min(2).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: ['com', 'pl', 'net'],
  }),
  phone: Joi.string()
    .regex(/^\d{3}-\d{3}-\d{3}$/)
    .message({
      'string.pattern.base': `Phone number must be written as 777-777-777.`,
    }),
  favorite: Joi.boolean(),
};

const registrationSchema = Joi.object({
  ...baseContactSchema,
  name: baseContactSchema.name.required(),
  email: baseContactSchema.email.required(),
  phone: baseContactSchema.phone.required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: ['com', 'pl', 'net'],
  }).required(),
  password: Joi.string().min(8).required(),
});


const updateContactSchema = Joi.object(baseContactSchema);

const validate = (schema, body, next) => {
  const { error } = schema.validate(body);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: 400,
      message: `Field: ${message}`,
    });
  }
  next();
};

module.exports.userRegistrationValidator = (req, res, next) => {
  const { error } = registrationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Validation error', details: error.details });
  }
  next();
};

module.exports.contactUpdateValidator = (req, res, next) => {
  const { error } = updateContactSchema.validate(req.body);
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  if (error) {
    const [{ message }] = error.details;
    return res.status(400).json({ message });
  }
  next();
};

module.exports.userValidateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Validation error', details: error.details });
  }
  next();
};