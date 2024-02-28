const path = require('path');
const { User } = require('../models/users.schema');
const Jimp = require('jimp');
const avatarDir = path.resolve("public", "avatars");

const signup = async (body) => {
  try {
    const { email, password, avatarURL } = body;

    const newUser = new User({ email, avatarURL });
    newUser.setPassword(password);
    await newUser.save();

    return newUser;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const login = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const updatedAvatar = async (file, userId) => {
  try {
    if (!file) {
      throw new Error("No file uploaded");
    }

    const { buffer, originalname } = file;
    const avatarFileName = `${Date.now()}_${originalname}`;
    const imagePath = path.join(avatarDir, avatarFileName);
    const image = await Jimp.read(buffer);

    await image.resize(250, 250);
    await image.writeAsync(imagePath);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatarURL: imagePath },
      { new: true } 
    );

    return { avatarURL: updatedUser.avatarURL };
  } catch (error) {
    console.error("updatedAvatar:", error.message);
    throw error;
  }
};

module.exports = { signup, login, updatedAvatar };
