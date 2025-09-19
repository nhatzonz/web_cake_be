const shopInfoService = require('../services/shopInfoService');

async function createShopInfo(req, res) {
  try {
    const shopInfo = await shopInfoService.createShopInfo(req.file, req.body);
    return res.status(201).json(shopInfo);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Lỗi server' });
  }
}

async function getShopInfo(req, res) {
  const shopInfo = await shopInfoService.getShopInfo();
  return res.status(200).json(shopInfo);
}


async function updateShopInfo(req, res) {
  try {
    const shopInfo = await shopInfoService.updateShopInfo(req.file, req.body);
    return res.status(200).json(shopInfo);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Lỗi server khi cập nhật thông tin cửa hàng' });
  }
}

async function deleteShopInfo(req, res) {
  try {
    const result = await shopInfoService.deleteShopInfo();
    return res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Lỗi server khi xóa thông tin cửa hàng' });
  }
}

module.exports = {
  createShopInfo,
  getShopInfo,
  updateShopInfo,
  deleteShopInfo,
};