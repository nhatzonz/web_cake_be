const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const productSectionController = require('../controllers/productSectionController');

const router = express.Router();

// Public routes - Lấy sections của sản phẩm
router.get('/product/:productId', productSectionController.getProductSections);

// Protected routes - Quản lý sections (cần authentication)
router.post('/product/:productId', auth, productSectionController.createProductSection);
router.put('/:sectionId', auth, productSectionController.updateProductSection);
router.delete('/:sectionId', auth, productSectionController.deleteProductSection);

// Protected routes - Quản lý items
router.post('/:sectionId/items', auth, productSectionController.createSectionItem);
router.put('/items/:itemId', auth, productSectionController.updateSectionItem);
router.delete('/items/:itemId', auth, productSectionController.deleteSectionItem);

// Upload image for section item
router.post('/upload-image', auth, upload.single('image'), productSectionController.uploadSectionImage);

module.exports = router;
