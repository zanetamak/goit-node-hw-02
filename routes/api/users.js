const express = require('express');
const jwt = require("jsonwebtoken");
const validate = require('../api/validation');
const { login, signup } = require('../../controllers/user');
const authenticateToken = require('../../middleware/authenticate');
const e = require('express');

const router = express.Router();

router.post("/signup", authenticateToken, async (req, res, next) => {
  try {
    const { email, password, subscription } = req.body;

    const { error } = validate.userRegistrationValidator.validate({
      email,
      password,
    });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email in use" });
    }

    const newUser = await signup({ email, password, subscription });
    return res
      .status(201)
      .json({
      user: { email: newUser.email, subscription: newUser.subscription },
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", authenticateToken, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { error } = userValidateLogin.validate({ email, password });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message });
    }

    const user = await login(email, password);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Email or password is wrong" });
    }

    const isPasswordValid = user.validPassword(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.token = token;
    await user.save();

    return res
      .status(200)
      .json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/logout', authenticateToken, async (req, res, next) => {
    try {
    const user = req.user;

    user.token = null;
    await user.save();
      res
        .status(204)
        .send();
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      res
        .status(401)
      json({ message: 'Not authorized' });
    } else {
      next(error);
    }
  }
});

router.get('/current', authenticateToken, async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res
        .status(401)
        .json({ message: "Not authorized" });
    }

    res
      .status(200)
      .json({
      email: currentUser.email,
      subscription: currentUser.subscription,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

