const { User } = require('../models/users.schema');

const signup = async (body) => {
     try {
    const { email, password } = body;
    const newUser = new User({ email });
    newUser.setPassword(password);
    await newUser.save();
    return newUser;
    } catch (error) {
     console.error('Error:', error.message);
    throw error;
    }
};

const login = async (email) => {
  try {
    const user = await User.findOne({ email });
      return user;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};



module.exports = { signup, login };
