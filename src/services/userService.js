const bcrypt = require('bcryptjs');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

async function createUser(username, password) {
  if (!username || !password) {
    const error = new Error('username và password là bắt buộc');
    error.status = 400;
    throw error;
  }

  const existing = await User.findOne({ where: { username } });
  if (existing) {
    const error = new Error('Username đã tồn tại');
    error.status = 409;
    throw error;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashed });

  // Tạo token sau khi user được tạo thành công
  const payload = { id: user.id, username: user.username };
  const secret = process.env.JWT_SECRET || 'dev_secret_key_change_me';
  const token = jwt.sign(payload, secret, { expiresIn: '7d' });

  return { ...payload, token };  // chỉ return một lần
}


async function verifyLogin(username, password) {
  if (!username || !password) {
    const error = new Error('username và password là bắt buộc');
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({ where: { username } });
  if (!user) {
    const error = new Error('Sai thông tin đăng nhập');
    error.status = 401;
    throw error;
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const error = new Error('Sai thông tin đăng nhập');
    error.status = 401;
    throw error;
  }

  // Tạo token giống như createUser
  const payload = { id: user.id, username: user.username };
  const secret = process.env.JWT_SECRET || 'dev_secret_key_change_me';
  const token = jwt.sign(payload, secret, { expiresIn: '7d' });

  return { message: 'Đăng nhập thành công', ...payload, token };
}


module.exports = {
  createUser,
  verifyLogin,
};


