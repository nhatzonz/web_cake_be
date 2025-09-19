const express = require('express');
const router = express.Router();
const requestCallController = require('../controllers/requestCallController');
const auth = require('../middleware/auth');

// Public routes
router.post('/', requestCallController.createRequestCall);

// Protected routes (require authentication)
router.get('/', auth, requestCallController.listRequestCalls);
router.get('/:id', auth, requestCallController.getRequestCall);
router.put('/:id', auth, requestCallController.updateRequestCall);
router.delete('/:id', auth, requestCallController.deleteRequestCall);

module.exports = router;
