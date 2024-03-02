const express = require('express');
const jwt = require("jsonwebtoken");
const gravatar = require('gravatar');
const { userValidateLogin, userRegistrationValidator } = require('../api/validation');
const { login, signup } = require('../../controllers/user');
const authenticateToken = require('../../middleware/authenticate');
const upload = require('../../middleware/updateAvatar');
const { v4: uuidv4 } = require("uuid");
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const router = express.Router();

const sendVerificationEmail = async (email, verificationToken) => {
  const msg = {
    to: email,
    from: 'zaneta.zawislak@gmail.com',
    subject: 'Email Verification',
    text: `Click the following link to verify your email: ${process.env.BASE_URL}/users/verify/${verificationToken}`,
  };

  await sgMail.send(msg)
};

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

    const verificationToken = uuidv4();
    const avatarURL = gravatar.url(email, { s: '200', r: 'pg', d: 'identicon' });

    const newUser = await signup({ email, password, subscription, avatarURL, verificationToken });

    await sendVerificationEmail(email, verificationToken);

    return res
      .status(201)
      .json({
        user: { email: newUser.email, subscription: newUser.subscription, avatarURL: newUser.avatarURL },
        message: "User registered successfully. Please check your email for verification instructions.",
      });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

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

    if (!user.verify) {
      return res
        .status(401)
        .json({ message: "Email not verified. Please verify your email to log in." });
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

router.patch("/avatars", auth, upload.single('avatar'), async (req, res, next) => {
  try {
    const updatedAvatar = await userController.updateAvatarUser(req.file, req.body.userId);
    res
      .status(200)
      .json(updatedAvatar);
  } catch (error) {
    next(error);
  }
});

  router.get('/verify/:verificationToken', async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await verifyUser(verificationToken);

    if (user) {
      user.verificationToken = null;
      user.verify = true;

      await user.save();

      return res
        .status(200)
        .json({ message: 'Verification successful' });
    } else {
      return res
        .status(404)
        .json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
    return res
      .status(500)
      .json({ message: 'Server error' });
  }
});

module.exports = router;

