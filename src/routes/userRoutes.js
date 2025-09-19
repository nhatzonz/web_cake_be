const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// POST /api/users
router.post('/', userController.createUser);

// POST /api/users/login
router.post('/login', userController.login);

module.exports = router;


