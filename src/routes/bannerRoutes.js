const express = require('express');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const bannerController = require('../controllers/bannerController');

const router = express.Router();

// POST /api/banners - upload 1 ảnh
router.post('/', auth, upload.single('image'), bannerController.createBanner);

// GET /api/banners - lấy tất cả banners
router.get('/', bannerController.getBanners);

// PUT /api/banners/:id - update 1 banner
router.put('/:id', auth, upload.single('image'), bannerController.updateBanner);

// DELETE /api/banners/:id - delete 1 banner
router.delete('/:id', auth, bannerController.deleteBanner);

module.exports = router;


