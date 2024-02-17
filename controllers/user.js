const { User } = require('../models/users.schema');
const authenticate = require('../middleware/authenticate');

const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const signupResult = await User.signup(email, password);
        return signupResult;
    } catch (error) {
     console.error('Error:', error.message);
    throw error;
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const loginResult = await User.login(email, password);
        return loginResult;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};

const logout = async (user) => {
  try {
    await User.logout(req.user);
    res.status(204).end();
  } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};

const current = async (user) => {
  try {
    const currentUser = await User.current(req.user);
    res.status(200).json(currentUser);
  } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};

module.exports = { signup, login, logout, current };
