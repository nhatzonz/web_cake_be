const express = require('express');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const shopInfoController = require('../controllers/shopInfoController');

const router = express.Router();

// Public routes
router.get('/', shopInfoController.getShopInfo);

// Protected routes (require authentication)
router.post('/', auth, upload.single('image'), shopInfoController.createShopInfo);
router.put('/', auth, upload.single('image'), shopInfoController.updateShopInfo);
router.delete('/', auth, shopInfoController.deleteShopInfo);

module.exports = router;


