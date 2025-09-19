const express = require('express');
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', auth, upload.array('images', 10), productController.createProduct);
router.get('/', productController.listProducts);

// Attributes routes should come before /:id routes
router.get('/attributes', productController.listAttributes);
router.post('/attributes', auth, productController.createAttribute);
router.put('/attributes/:id', auth, productController.updateAttribute);
router.delete('/attributes/:id', auth, productController.deleteAttribute);

// Product-specific routes
router.put('/:id', auth, upload.array('images', 10), productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);
router.get('/:id', productController.getProduct);

router.post('/:product_id/attribute-values', auth, productController.addAttributeValues);
router.put('/attribute-values/:id', auth, productController.updateAttributeValue);
router.delete('/attribute-values/:id', auth, productController.deleteAttributeValue);

module.exports = router;
