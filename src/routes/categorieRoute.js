const express = require('express');
const categorieController = require('../controllers/categorieController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/', auth, upload.single('image'), categorieController.createCategorie);
router.get('/', categorieController.getCategories);
router.put('/:id', auth, upload.single('image'), categorieController.updateCategorie);
router.delete('/:id', categorieController.deleteCategorie);
router.get('/:id', categorieController.getCategorieById);

module.exports = router;