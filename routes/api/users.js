const express = require('express');
const jwt = require("jsonwebtoken");
const gravatar = require('gravatar');
const { userValidateLogin, userRegistrationValidator } = require('../api/validation');
const { login, signup } = require('../../controllers/user');
const authenticateToken = require('../../middleware/authenticate');
const upload = require('../../middleware/updateAvatar')


const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, subscription } = req.body;

    const signUpByUser = userRegistrationValidator.validate({ email, password });
    if (signUpByUser.error) {
      return res
        .status(400)
        .json({ message: signUpByUser.error.details[0].message });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email in use" });
    }

const avatarURL = gravatar.url(email, { s: '200', r: 'pg', d: 'identicon' });


    const newUser = await signup({ email, password, subscription, avatarURL });
    return res
      .status(201)
      .json({
      user: { email: newUser.email, subscription: newUser.subscription, avatarURL: newUser.avatarURL },
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email } = req.body;

    const loginByUser = userValidateLogin.validate({ email });
    if (loginByUser.error) {
      return res
        .status(400)
        .json({ message: loginByUser.error.details[0].message });
    }

    const user = await login(email);

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

router.patch("/avatars", upload.single('avatar'), async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization !== 'Bearer {{token}}') {
      return res
        .status(401)
        .json({ message: 'Not authorized' });
    }
    const updatedAvatar = await userController.updateAvatarUser(req.file, req.body.userId);
    res
      .status(200)
      .json(updatedAvatar);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

