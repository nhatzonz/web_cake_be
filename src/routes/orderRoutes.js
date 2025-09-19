const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

// Public routes
router.post('/', orderController.createOrder);

// Protected routes (require authentication)
router.get('/', auth, orderController.listOrders);
router.get('/:id', auth, orderController.getOrder);
router.put('/:id', auth, orderController.updateOrder);
router.delete('/:id', auth, orderController.deleteOrder);

module.exports = router;


