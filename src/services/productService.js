const path = require('path');
const { Products, ProductImages, ProductAttributes, ProductAttributeValues, Categories } = require('../models');

function toSlug(input) {
  return String(input || '')
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function createProduct(payload, files) {
  if (!payload?.name) { const e = new Error('Thiếu tên sản phẩm'); e.status = 400; throw e; }
  if (payload?.price === undefined) { const e = new Error('Thiếu giá sản phẩm'); e.status = 400; throw e; }

  const data = {
    category_id: payload.category_id ? Number(payload.category_id) : null,
    name: payload.name,
    code: payload.code || null,
    slug: payload.slug ? toSlug(payload.slug) : toSlug(payload.name),
    price: Number(payload.price),
    instock: payload.instock === 'false' ? false : true,
    star1: payload.star1 === 'true' || payload.star1 === true,
    star2: payload.star2 === 'true' || payload.star2 === true,
    description: payload.description || null,
    sort_order: payload.sort_order ? Number(payload.sort_order) : 0,
  };

  const product = await Products.create(data);

  // Save images
  const images = Array.isArray(files) ? files : (files?.images || []);
  const mainIndex = payload.main_index !== undefined ? Number(payload.main_index) : 0;
  for (const [index, f] of images.entries()) {
    const image_url = path.posix.join('/uploads', path.basename(f.path));
    await ProductImages.create({ product_id: product.id, image_url, is_main: index === mainIndex, sort_order: index });
  }

  // Save attributes
  if (payload.attributes) {
    // attributes expected as JSON string: [{attribute_id, value, extra_price}]
    const list = typeof payload.attributes === 'string' ? JSON.parse(payload.attributes) : payload.attributes;
    for (const item of list || []) {
      if (!item.attribute_id || !item.value) continue;
      await ProductAttributeValues.create({
        product_id: product.id,
        attribute_id: Number(item.attribute_id),
        value: String(item.value),
        extra_price: item.extra_price ? Number(item.extra_price) : 0,
      });
    }
  }

  return product;
}

async function updateProduct(id, payload, files) {
  const product = await Products.findOne({ where: { id, isDelete: false } });
  if (!product) { const e = new Error('Sản phẩm không tồn tại'); e.status = 404; throw e; }
  const next = { ...product.toJSON() };
  if (payload.name !== undefined) next.name = payload.name;
  if (payload.slug !== undefined) next.slug = payload.slug ? toSlug(payload.slug) : toSlug(next.name);
  if (payload.code !== undefined) next.code = payload.code || null;
  if (payload.price !== undefined) next.price = Number(payload.price);
  if (payload.description !== undefined) next.description = payload.description;
  if (payload.sort_order !== undefined) next.sort_order = Number(payload.sort_order) || 0;
  if (payload.instock !== undefined) next.instock = payload.instock === 'true' || payload.instock === true;
  if (payload.star1 !== undefined) next.star1 = payload.star1 === 'true' || payload.star1 === true;
  if (payload.star2 !== undefined) next.star2 = payload.star2 === 'true' || payload.star2 === true;
  await Products.update({
    name: next.name, slug: next.slug, code: next.code, price: next.price, description: next.description, sort_order: next.sort_order,
    instock: next.instock, star1: next.star1, star2: next.star2,
  }, { where: { id } });

  // optional: add more images
  const images = Array.isArray(files) ? files : (files?.images || []);
  if (images.length > 0) {
    const replaceAll = payload.replace_images === 'true' || payload.replace_images === true;
    const mainIndex = payload.main_index !== undefined ? Number(payload.main_index) : 0;
    if (replaceAll) {
      await ProductImages.destroy({ where: { product_id: product.id } });
    }
    let currentMaxOrder = 0;
    if (!replaceAll) {
      const existing = await ProductImages.findAll({ where: { product_id: product.id }, order: [['sort_order','DESC']] });
      currentMaxOrder = existing.length ? (existing[0].sort_order || 0) + 1 : 0;
    }
    for (const [idx, f] of images.entries()) {
      const image_url = path.posix.join('/uploads', path.basename(f.path));
      await ProductImages.create({ product_id: product.id, image_url, is_main: idx === mainIndex, sort_order: (replaceAll ? idx : currentMaxOrder + idx) });
    }
    if (!replaceAll && images.length > 0 && payload.main_index !== undefined) {
      // If not replacing all, but main_index provided for newly added set, ensure only one main overall
      await ProductImages.update({ is_main: false }, { where: { product_id: product.id } });
      // set main for the last inserted batch's main
      const targetOrder = currentMaxOrder + mainIndex;
      const target = await ProductImages.findOne({ where: { product_id: product.id, sort_order: targetOrder } });
      if (target) await ProductImages.update({ is_main: true }, { where: { id: target.id } });
    }
  }

  // optional: update attributes without losing old ones unless replace_attributes=true
  if (payload.attributes) {
    const list = typeof payload.attributes === 'string' ? JSON.parse(payload.attributes) : payload.attributes;
    const replace = payload.replace_attributes === 'true' || payload.replace_attributes === true;
    const removeMissing = payload.remove_missing === 'true' || payload.remove_missing === true;

    if (replace) {
      await ProductAttributeValues.destroy({ where: { product_id: product.id } });
    }

    const existing = await ProductAttributeValues.findAll({ where: { product_id: product.id } });
    for (const item of list || []) {
      if (!item.attribute_id || !item.value) continue;
      const attrId = Number(item.attribute_id);
      const val = String(item.value);
      const extra = item.extra_price ? Number(item.extra_price) : 0;
      const found = existing.find((e) => e.attribute_id === attrId && String(e.value) === val);
      if (found) {
        await found.update({ extra_price: extra });
      } else {
        await ProductAttributeValues.create({ product_id: product.id, attribute_id: attrId, value: val, extra_price: extra });
      }
    }

    if (!replace && removeMissing) {
      const keep = new Set((list || []).map((i) => `${Number(i.attribute_id)}|${String(i.value)}`));
      for (const e of existing) {
        if (!keep.has(`${e.attribute_id}|${e.value}`)) {
          await e.destroy();
        }
      }
    }
  }

  return await Products.findOne({ where: { id } });
}

async function deleteProduct(id) {
  const product = await Products.findOne({ where: { id, isDelete: false } });
  if (!product) { const e = new Error('Sản phẩm không tồn tại'); e.status = 404; throw e; }
  await Products.update({ isDelete: true }, { where: { id } });
  return { success: true };
}

// Attribute CRUD
async function createAttribute({ name, slug }) {
  if (!name) { const e = new Error('Thiếu tên thuộc tính'); e.status = 400; throw e; }
  const s = slug && slug.trim() ? toSlug(slug) : toSlug(name);
  return ProductAttributes.create({ name, slug: s });
}
async function updateAttribute(id, { name, slug, isDelete }) {
  const item = await ProductAttributes.findOne({ where: { id, isDelete: false } });
  if (!item) { const e = new Error('Thuộc tính không tồn tại'); e.status = 404; throw e; }
  const s = slug !== undefined ? (slug ? toSlug(slug) : toSlug(name || item.name)) : item.slug;
  await ProductAttributes.update({ name: name ?? item.name, slug: s, isDelete: isDelete ?? item.isDelete }, { where: { id } });
  return await ProductAttributes.findOne({ where: { id } });
}
async function deleteAttribute(id) {
  const item = await ProductAttributes.findOne({ where: { id, isDelete: false } });
  if (!item) { const e = new Error('Thuộc tính không tồn tại'); e.status = 404; throw e; }
  await ProductAttributes.update({ isDelete: true }, { where: { id } });
  return { success: true };
}
async function listAttributes() {
  try {
    const items = await ProductAttributes.findAll({ where: { isDelete: false } });
    return items;
  } catch (error) {
    console.error("Error in listAttributes:", error);
    throw error;
  }
}

// Attribute Values for a product
async function addAttributeValues(product_id, values) {
  for (const item of values || []) {
    if (!item.attribute_id || !item.value) continue;
    await ProductAttributeValues.create({
      product_id: Number(product_id),
      attribute_id: Number(item.attribute_id),
      value: String(item.value),
      extra_price: item.extra_price ? Number(item.extra_price) : 0,
    });
  }
  return { success: true };
}
async function updateAttributeValue(id, { value, extra_price }) {
  await ProductAttributeValues.update({ value, extra_price: extra_price ? Number(extra_price) : 0 }, { where: { id } });
  return await ProductAttributeValues.findOne({ where: { id } });
}
async function deleteAttributeValue(id) {
  await ProductAttributeValues.destroy({ where: { id } });
  return { success: true };
}

module.exports = {
  createProduct, updateProduct, deleteProduct,
  createAttribute, updateAttribute, deleteAttribute, listAttributes,
  addAttributeValues, updateAttributeValue, deleteAttributeValue,
  getProduct,
};

// List products (optionally by category_id)
async function listProducts({ category_id } = {}) {
  const where = { isDelete: false };
  if (category_id) where.category_id = Number(category_id);
  return Products.findAll({ 
    where,
     order: [['sort_order', 'ASC'], ['id', 'ASC']],
    include: [
      {
        model: ProductImages,
        as: 'images',
        attributes: ['image_url', 'is_main', 'sort_order'],
      },
    ],
    });
}

async function getProduct(id) {
  return Products.findOne({ 
    where: { id, isDelete: false }, 
    include: [
      { 
        model: ProductImages, 
        as: 'images', 
        attributes: ['image_url', 'is_main', 'sort_order'] 
      },
      {
        model: Categories,
        as: 'category',
        attributes: ['id', 'name', 'slug']
      },
      {
        model: ProductAttributeValues,
        as: 'product_attribute_values',
        attributes: ['id', 'value', 'extra_price'],
        include: [{
          model: ProductAttributes,
          as: 'product_attribute',
          attributes: ['id', 'name', 'slug']
        }]
      }
    ]
  });
}

module.exports.listProducts = listProducts;
module.exports.getProduct = getProduct;
