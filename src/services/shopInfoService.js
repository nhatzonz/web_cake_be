const path = require('path');
const { ShopInfo } = require('../models');

async function createShopInfo(file, payload) {
  if (!file) {
    const error = new Error('Thiếu file ảnh (field: image)');
    error.status = 400;
    throw error;
  }

  const { name, phone, email, address, link_face, link_mess, link_tiktok } = payload;
  const relativePath = path.posix.join('/uploads', path.basename(file.path));

  const shopInfo = await ShopInfo.create({
    name, phone, email, address, link_face, link_mess, link_tiktok, logo_image: relativePath,
  });

  return shopInfo;
}

async function getShopInfo() {
  const shopInfo = await ShopInfo.findOne({ where: { id: 1 } });
  return shopInfo;
}

async function updateShopInfo(file, payload) {
  const { name, phone, email, address, link_face, link_mess, link_tiktok } = payload;
  
  const updateData = { name, phone, email, address, link_face, link_mess, link_tiktok };
  
  // Nếu có file mới, cập nhật logo_image
  if (file) {
    const relativePath = path.posix.join('/uploads', path.basename(file.path));
    updateData.logo_image = relativePath;
  }

  await ShopInfo.update(updateData, { where: { id: 1 } });
  const updatedShopInfo = await ShopInfo.findByPk(1);
  return updatedShopInfo;
}

async function deleteShopInfo() {
  const shopInfo = await ShopInfo.findByPk(1);
  if (!shopInfo) {
    const error = new Error('Thông tin cửa hàng không tồn tại');
    error.status = 404;
    throw error;
  }

  await ShopInfo.destroy({ where: { id: 1 } });
  return { message: 'Thông tin cửa hàng đã được xóa thành công' };
}

module.exports = {
  createShopInfo,
  getShopInfo,
  updateShopInfo,
  deleteShopInfo,
};