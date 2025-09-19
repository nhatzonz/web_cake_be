const { ProductSection, ProductSectionItem } = require('../models');

// Lấy tất cả sections của một sản phẩm
async function getProductSections(productId) {
  const sections = await ProductSection.findAll({
    where: { product_id: productId },
    include: [{
      model: ProductSectionItem,
      as: 'items',
      order: [['sort_order', 'ASC']]
    }],
    order: [['sort_order', 'ASC']]
  });
  return sections;
}

// Tạo section mới
async function createProductSection(productId, sectionData) {
  const { title, sort_order = 0, items = [] } = sectionData;
  
  const section = await ProductSection.create({
    product_id: productId,
    title,
    sort_order
  });

  // Tạo items cho section
  if (items && items.length > 0) {
    for (const item of items) {
      await ProductSectionItem.create({
        section_id: section.id,
        content: item.content,
        is_image: item.is_image || false,
        sort_order: item.sort_order || 0
      });
    }
  }

  // Lấy lại section với items
  const createdSection = await ProductSection.findByPk(section.id, {
    include: [{
      model: ProductSectionItem,
      as: 'items',
      order: [['sort_order', 'ASC']]
    }]
  });

  return createdSection;
}

// Cập nhật section
async function updateProductSection(sectionId, sectionData) {
  const { title, sort_order, items } = sectionData;
  
  const section = await ProductSection.findByPk(sectionId);
  if (!section) {
    const error = new Error('Section không tồn tại');
    error.status = 404;
    throw error;
  }

  // Cập nhật thông tin section
  if (title !== undefined) section.title = title;
  if (sort_order !== undefined) section.sort_order = sort_order;
  await section.save();

  // Cập nhật items nếu có
  if (items && Array.isArray(items)) {
    // Xóa tất cả items cũ
    await ProductSectionItem.destroy({
      where: { section_id: sectionId }
    });

    // Tạo items mới
    for (const item of items) {
      await ProductSectionItem.create({
        section_id: sectionId,
        content: item.content,
        is_image: item.is_image || false,
        sort_order: item.sort_order || 0
      });
    }
  }

  // Lấy lại section với items
  const updatedSection = await ProductSection.findByPk(sectionId, {
    include: [{
      model: ProductSectionItem,
      as: 'items',
      order: [['sort_order', 'ASC']]
    }]
  });

  return updatedSection;
}

// Xóa section
async function deleteProductSection(sectionId) {
  const section = await ProductSection.findByPk(sectionId);
  if (!section) {
    const error = new Error('Section không tồn tại');
    error.status = 404;
    throw error;
  }

  // Xóa tất cả items trước
  await ProductSectionItem.destroy({
    where: { section_id: sectionId }
  });

  // Xóa section
  await ProductSection.destroy({
    where: { id: sectionId }
  });

  return { message: 'Section đã được xóa thành công' };
}

// Tạo item mới cho section
async function createSectionItem(sectionId, itemData) {
  const { content, is_image = false, sort_order = 0 } = itemData;
  
  const section = await ProductSection.findByPk(sectionId);
  if (!section) {
    const error = new Error('Section không tồn tại');
    error.status = 404;
    throw error;
  }

  const item = await ProductSectionItem.create({
    section_id: sectionId,
    content,
    is_image,
    sort_order
  });

  return item;
}

// Cập nhật item
async function updateSectionItem(itemId, itemData) {
  const { content, is_image, sort_order } = itemData;
  
  const item = await ProductSectionItem.findByPk(itemId);
  if (!item) {
    const error = new Error('Item không tồn tại');
    error.status = 404;
    throw error;
  }

  if (content !== undefined) item.content = content;
  if (is_image !== undefined) item.is_image = is_image;
  if (sort_order !== undefined) item.sort_order = sort_order;
  
  await item.save();
  return item;
}

// Xóa item
async function deleteSectionItem(itemId) {
  const item = await ProductSectionItem.findByPk(itemId);
  if (!item) {
    const error = new Error('Item không tồn tại');
    error.status = 404;
    throw error;
  }

  await ProductSectionItem.destroy({
    where: { id: itemId }
  });

  return { message: 'Item đã được xóa thành công' };
}

module.exports = {
  getProductSections,
  createProductSection,
  updateProductSection,
  deleteProductSection,
  createSectionItem,
  updateSectionItem,
  deleteSectionItem,
};
