const userService = require('../services/userService');

async function createUser(req, res) {
  try {
    const { username, password } = req.body;
    const result = await userService.createUser(username, password);
    return res.status(201).json(result);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Lỗi server' });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const result = await userService.verifyLogin(username, password);
    return res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Lỗi server' });
  }
}

module.exports = {
  createUser,
  login,
};


