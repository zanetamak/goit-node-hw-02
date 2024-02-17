const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validate = require('../api/validation');
const { login, signup, logout, current } = require('../../controllers/user');
const authenticate = require('../../middleware/authenticate');

const router = express.Router();

router.post('/signup', validate.userRegistrationValidator, async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res
            .status(409)
            .json({
                message: "Email in use",
            });
        }

        const signupResult = await signup(req, res);
      return res
        .status(200)
        .json({
            message: "User registered successfully",
            user: signupResult,
        });

    } catch (error) {
    next(error);
  }
});

router.post('/users/login', validate.userValidateLogin, async (req, res) => {
    try {
        const loginResult = await login(req, res);

        if (!loginResult.success) {
          return res
            .status(401)
            .json({ message: "Email or password is wrong" });
        }
        const user = loginResult.user;
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        user.token = token;
        await user.save();

      return res
        .status(200)
        .json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription
            }
        });

    } catch (error) {
    next(error);
    }
});

router.use(authenticate);

router.get('/logout', async (user) => {
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

router.get('/current', async (req, res) => {
  try {
    const user = req.user;

    res
      .status(200)
      .json({
      email: user.email,
      subscription: user.subscription
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'UnauthorizedError') {
      res
        .status(401)
        .json({ message: 'Not authorized' });
    } else {
    next(error);
  };
    }
  }
);

module.exports = router;