const db = require('../models');
const { Orders, OrderItems } = db;

async function createOrder(payload) {
  // payload: { customer_name, customer_phone, delivery_type, pickup_branch, district, ward, address, delivery_time, message_on_cake, note, payment_method, items: [{ product_id, product_name, attribute_summary, quantity, price, total }], total }
  if (!payload?.customer_name) { const e = new Error('Thiếu tên khách hàng'); e.status = 400; throw e; }
  if (!payload?.customer_phone) { const e = new Error('Thiếu số điện thoại'); e.status = 400; throw e; }
  if (!Array.isArray(payload.items) || payload.items.length === 0) { const e = new Error('Đơn hàng không có sản phẩm'); e.status = 400; throw e; }

  const order = await Orders.create({
    customer_name: payload.customer_name,
    customer_phone: payload.customer_phone,
    delivery_type: payload.delivery_type || 'self',
    pickup_branch: payload.pickup_branch || null,
    district: payload.district || null,
    ward: payload.ward || null,
    province: payload.province || null,
    address: payload.address || null,
    delivery_time: payload.delivery_time || null,
    message_on_cake: payload.message_on_cake || null,
    note: payload.note || null,
    payment_method: payload.payment_method || 'cod',
    status: 'pending',
    total: Number(payload.total || 0),
  });

  for (const it of payload.items) {
    await OrderItems.create({
      order_id: order.id,
      product_id: it.product_id,
      product_name: it.product_name,
      attribute_summary: it.attribute_summary || null,
      quantity: Number(it.quantity || 1),
      price: Number(it.price || 0),
      total: Number(it.total || 0),
    });
  }

  return order;
}

async function listOrders() {
  const orders = await Orders.findAll({
    include: [
      {
        model: OrderItems,
        as: 'items',
      },
    ],
    order: [['created_at', 'DESC']],
  });
  return orders;
}

async function getOrder(id) {
  const order = await Orders.findByPk(id, {
    include: [
      {
        model: OrderItems,
        as: 'items',
      },
    ],
  });
  if (!order) {
    const e = new Error('Đơn hàng không tồn tại');
    e.status = 404;
    throw e;
  }
  return order;
}

async function updateOrder(id, payload) {
  const order = await Orders.findByPk(id);
  if (!order) {
    const e = new Error('Đơn hàng không tồn tại');
    e.status = 404;
    throw e;
  }

  const updateData = {};
  if (payload.customer_name !== undefined) updateData.customer_name = payload.customer_name;
  if (payload.customer_phone !== undefined) updateData.customer_phone = payload.customer_phone;
  if (payload.delivery_type !== undefined) updateData.delivery_type = payload.delivery_type;
  if (payload.pickup_branch !== undefined) updateData.pickup_branch = payload.pickup_branch;
  if (payload.district !== undefined) updateData.district = payload.district;
  if (payload.ward !== undefined) updateData.ward = payload.ward;
  if (payload.province !== undefined) updateData.province = payload.province;
  if (payload.address !== undefined) updateData.address = payload.address;
  if (payload.delivery_time !== undefined) updateData.delivery_time = payload.delivery_time;
  if (payload.message_on_cake !== undefined) updateData.message_on_cake = payload.message_on_cake;
  if (payload.note !== undefined) updateData.note = payload.note;
  if (payload.payment_method !== undefined) updateData.payment_method = payload.payment_method;
  if (payload.status !== undefined) updateData.status = payload.status;
  if (payload.total !== undefined) updateData.total = Number(payload.total);

  await Orders.update(updateData, { where: { id } });

  // Nếu có items mới, cập nhật order_items
  if (payload.items && Array.isArray(payload.items)) {
    await OrderItems.destroy({ where: { order_id: id } });
    for (const item of payload.items) {
      await OrderItems.create({
        order_id: id,
        product_id: item.product_id,
        product_name: item.product_name,
        attribute_summary: item.attribute_summary || null,
        quantity: Number(item.quantity || 1),
        price: Number(item.price || 0),
        total: Number(item.total || 0),
      });
    }
  }

  return await Orders.findByPk(id, {
    include: [
      {
        model: OrderItems,
        as: 'items',
      },
    ],
  });
}

async function deleteOrder(id) {
  const order = await Orders.findByPk(id);
  if (!order) {
    const e = new Error('Đơn hàng không tồn tại');
    e.status = 404;
    throw e;
  }

  // Xóa order_items trước
  await OrderItems.destroy({ where: { order_id: id } });
  // Xóa order
  await Orders.destroy({ where: { id } });

  return { message: 'Đơn hàng đã được xóa thành công' };
}

module.exports = { createOrder, listOrders, getOrder, updateOrder, deleteOrder };


