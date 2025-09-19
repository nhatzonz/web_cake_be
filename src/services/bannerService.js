const path = require('path');
const { Banner } = require('../models');

async function createBanner(file, payload) {
  if (!file) {
    const error = new Error('Thiếu file ảnh (field: image)');
    error.status = 400;
    throw error;
  }

  const { isSubBanner, sort_order } = payload || {};
  const relativePath = path.posix.join('/uploads', path.basename(file.path));

  const banner = await Banner.create({
    image_url: relativePath,
    isSubBanner: isSubBanner === 'true' || isSubBanner === true,
    sort_order: sort_order ? Number(sort_order) : 0,
  });

  return banner;
}

async function getBanners() {
  const banners = await Banner.findAll({ order: [['sort_order', 'ASC'], ['id', 'ASC']] });
  return banners;
}

async function updateBanner(id, payload, file) {
  const item = await Banner.findOne({ where: { id } });
  if (!item) {
    const e = new Error('Banner không tồn tại');
    e.status = 404; throw e;
  }
  const next = { ...item.toJSON() };
  if (payload.isSubBanner !== undefined) next.isSubBanner = (payload.isSubBanner === 'true' || payload.isSubBanner === true);
  if (payload.sort_order !== undefined) next.sort_order = Number(payload.sort_order) || 0;
  if (file) next.image_url = path.posix.join('/uploads', path.basename(file.path));
  await Banner.update({ image_url: next.image_url, isSubBanner: next.isSubBanner, sort_order: next.sort_order }, { where: { id } });
  return await Banner.findOne({ where: { id } });
}

async function deleteBanner(id) {
  const count = await Banner.destroy({ where: { id } });
  if (count === 0) {
    const e = new Error('Banner không tồn tại');
    e.status = 404; throw e;
  }
  return { success: true };
}

module.exports = {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
};


