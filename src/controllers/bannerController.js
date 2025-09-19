const bannerService = require('../services/bannerService');

async function createBanner(req, res) {
  try {
    const banner = await bannerService.createBanner(req.file, req.body);
    return res.status(201).json(banner);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Lỗi server' });
  }
}

async function getBanners(req, res) {
  try {
    const banners = await bannerService.getBanners();
    return res.status(200).json(banners);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Lỗi server' });
  }
}

async function updateBanner(req, res) {
  try {
    const banner = await bannerService.updateBanner(req.params.id, req.body, req.file);
    return res.status(200).json(banner);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Lỗi server' });
  }
}

async function deleteBanner(req, res) {
  try {
    const banner = await bannerService.deleteBanner(req.params.id);
    return res.status(200).json(banner);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Lỗi server' });
  }
}
module.exports = {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
};


