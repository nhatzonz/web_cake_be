const productSectionService = require('../services/productSectionService');
const path = require('path');

// Lấy tất cả sections của một sản phẩm
async function getProductSections(req, res) {
  try {
    const { productId } = req.params;
    const sections = await productSectionService.getProductSections(productId);
    return res.status(200).json(sections);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Lỗi server' });
  }
}

// Tạo section mới
async function createProductSection(req, res) {
  try {
    const { productId } = req.params;
    const section = await productSectionService.createProductSection(productId, req.body);
    return res.status(201).json(section);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Lỗi server khi tạo section' });
  }
}

// Cập nhật section
async function updateProductSection(req, res) {
  try {
    const { sectionId } = req.params;
    const section = await productSectionService.updateProductSection(sectionId, req.body);
    return res.status(200).json(section);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Lỗi server khi cập nhật section' });
  }
}

// Xóa section
async function deleteProductSection(req, res) {
  try {
    const { sectionId } = req.params;
    const result = await productSectionService.deleteProductSection(sectionId);
    return res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Lỗi server khi xóa section' });
  }
}

// Tạo item mới cho section
async function createSectionItem(req, res) {
  try {
    const { sectionId } = req.params;
    const item = await productSectionService.createSectionItem(sectionId, req.body);
    return res.status(201).json(item);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Lỗi server khi tạo item' });
  }
}

// Cập nhật item
async function updateSectionItem(req, res) {
  try {
    const { itemId } = req.params;
    const item = await productSectionService.updateSectionItem(itemId, req.body);
    return res.status(200).json(item);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Lỗi server khi cập nhật item' });
  }
}

// Xóa item
async function deleteSectionItem(req, res) {
  try {
    const { itemId } = req.params;
    const result = await productSectionService.deleteSectionItem(itemId);
    return res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Lỗi server khi xóa item' });
  }
}

// Upload image for section item
async function uploadSectionImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Thiếu file ảnh' });
    }

    const relativePath = path.posix.join('/uploads', path.basename(req.file.path));
    return res.status(200).json({ 
      message: 'Upload thành công',
      imageUrl: relativePath 
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Lỗi server khi upload ảnh' });
  }
}

module.exports = {
  getProductSections,
  createProductSection,
  updateProductSection,
  deleteProductSection,
  createSectionItem,
  updateSectionItem,
  deleteSectionItem,
  uploadSectionImage,
};
