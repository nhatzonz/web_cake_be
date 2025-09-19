const productService = require('../services/productService');

async function createProduct(req, res) {
  try {
    const product = await productService.createProduct(req.body, req.files || req.file);
    return res.status(201).json(product);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || 'Lỗi server' });
  }
}

async function updateProduct(req, res) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body, req.files || req.file);
    return res.status(200).json(product);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || 'Lỗi server' });
  }
}

async function deleteProduct(req, res) {
  try {
    const result = await productService.deleteProduct(req.params.id);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || 'Lỗi server' });
  }
}

// attributes
async function createAttribute(req, res) {
  try { const item = await productService.createAttribute(req.body); return res.status(201).json(item); }
  catch (e) { return res.status(e.status || 500).json({ message: e.message || 'Lỗi server' }); }
}
async function updateAttribute(req, res) {
  try { const item = await productService.updateAttribute(req.params.id, req.body); return res.status(200).json(item); }
  catch (e) { return res.status(e.status || 500).json({ message: e.message || 'Lỗi server' }); }
}
async function deleteAttribute(req, res) {
  try { const result = await productService.deleteAttribute(req.params.id); return res.status(200).json(result); }
  catch (e) { return res.status(e.status || 500).json({ message: e.message || 'Lỗi server' }); }
}
async function listAttributes(req, res) {
  try { 
    const items = await productService.listAttributes(); 
    return res.status(200).json(items || []); 
  }
  catch (e) { 
    console.error("Error in listAttributes controller:", e);
    return res.status(500).json({ message: 'Lỗi server', error: e.message }); 
  }
}

// attribute values
async function addAttributeValues(req, res) {
  try { const result = await productService.addAttributeValues(req.params.product_id, req.body.values || []); return res.status(200).json(result); }
  catch (e) { return res.status(e.status || 500).json({ message: e.message || 'Lỗi server' }); }
}
async function updateAttributeValue(req, res) {
  try { const item = await productService.updateAttributeValue(req.params.id, req.body); return res.status(200).json(item); }
  catch (e) { return res.status(e.status || 500).json({ message: e.message || 'Lỗi server' }); }
}
async function deleteAttributeValue(req, res) {
  try { const result = await productService.deleteAttributeValue(req.params.id); return res.status(200).json(result); }
  catch (e) { return res.status(e.status || 500).json({ message: e.message || 'Lỗi server' }); }
}

async function listProducts(req, res) {
  try {
    const items = await productService.listProducts({ category_id: req.query.category_id });
    return res.status(200).json(items);
  } catch (e) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
}

async function getProduct(req, res) {
  try { const item = await productService.getProduct(req.params.id); return res.status(200).json(item); }
  catch (e) { return res.status(e.status || 500).json({ message: e.message || 'Lỗi server' }); }
}

module.exports = {
  createProduct, updateProduct, deleteProduct,
  createAttribute, updateAttribute, deleteAttribute, listAttributes,
  addAttributeValues, updateAttributeValue, deleteAttributeValue,
  listProducts,
  getProduct,
};


