const path = require('path');
const { ShopInfo } = require('../models');

async function createShopInfo(file, payload) {
  const { name, phone, email, address, link_face, link_mess, link_tiktok } = payload;
  
  const shopInfoData = { name, phone, email, address, link_face, link_mess, link_tiktok };
  
  // Chỉ thêm logo_image nếu có file
  if (file) {
    const relativePath = path.posix.join('/uploads', path.basename(file.path));
    shopInfoData.logo_image = relativePath;
  }

  const shopInfo = await ShopInfo.create(shopInfoData);

  return shopInfo;
}

async function getShopInfo() {
  const shopInfo = await ShopInfo.findOne({ 
    order: [['id', 'DESC']] // Lấy record mới nhất
  });
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

  // Tìm record mới nhất để update
  const latestShopInfo = await ShopInfo.findOne({ 
    order: [['id', 'DESC']] 
  });
  
  if (!latestShopInfo) {
    const error = new Error('Không tìm thấy thông tin cửa hàng để cập nhật');
    error.status = 404;
    throw error;
  }

  await ShopInfo.update(updateData, { where: { id: latestShopInfo.id } });
  const updatedShopInfo = await ShopInfo.findByPk(latestShopInfo.id);
  return updatedShopInfo;
}

async function deleteShopInfo() {
  // Tìm record mới nhất để xóa
  const latestShopInfo = await ShopInfo.findOne({ 
    order: [['id', 'DESC']] 
  });
  
  if (!latestShopInfo) {
    const error = new Error('Không tìm thấy thông tin cửa hàng để xóa');
    error.status = 404;
    throw error;
  }

  await ShopInfo.destroy({ where: { id: latestShopInfo.id } });
  return { message: 'Thông tin cửa hàng đã được xóa thành công' };
}

module.exports = {
  createShopInfo,
  getShopInfo,
  updateShopInfo,
  deleteShopInfo,
};