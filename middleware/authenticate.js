const jwt = require('jsonwebtoken');
const User = require('../models/users.schema'); 
require("dotenv").config();

const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user && user.token === token) {
      req.user = user;
      next();
    } else {
      return res
        .status(401)
        .json({ message: 'Not authorized' });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Not authorized' });
  }
};

module.exports = authenticateToken;

