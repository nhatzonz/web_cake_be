const orderService = require('../services/orderService');

async function createOrder(req, res) {
  try {
    const order = await orderService.createOrder(req.body);
    return res.status(201).json(order);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || 'Lỗi server' });
  }
}

async function listOrders(req, res) {
  try {
    const orders = await orderService.listOrders();
    return res.json(orders);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || 'Lỗi server khi lấy danh sách đơn hàng' });
  }
}

async function getOrder(req, res) {
  try {
    const order = await orderService.getOrder(req.params.id);
    return res.json(order);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || 'Lỗi server khi lấy đơn hàng' });
  }
}

async function updateOrder(req, res) {
  try {
    const order = await orderService.updateOrder(req.params.id, req.body);
    return res.json(order);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || 'Lỗi server khi cập nhật đơn hàng' });
  }
}

async function deleteOrder(req, res) {
  try {
    const result = await orderService.deleteOrder(req.params.id);
    return res.json(result);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || 'Lỗi server khi xóa đơn hàng' });
  }
}

module.exports = {
  createOrder,
  listOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};


