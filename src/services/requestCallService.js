const db = require('../models');
const { RequestCall } = db;

async function createRequestCall(payload) {
  if (!payload?.phone) {
    const e = new Error('Thiếu số điện thoại');
    e.status = 400;
    throw e;
  }

  const requestCall = await RequestCall.create({
    phone: payload.phone,
    note: payload.note || null,
  });

  return requestCall;
}

async function listRequestCalls() {
  const requestCalls = await RequestCall.findAll({
    order: [['created_at', 'DESC']],
  });
  return requestCalls;
}

async function getRequestCall(id) {
  const requestCall = await RequestCall.findByPk(id);
  if (!requestCall) {
    const e = new Error('Yêu cầu gọi lại không tồn tại');
    e.status = 404;
    throw e;
  }
  return requestCall;
}

async function updateRequestCall(id, payload) {
  const requestCall = await RequestCall.findByPk(id);
  if (!requestCall) {
    const e = new Error('Yêu cầu gọi lại không tồn tại');
    e.status = 404;
    throw e;
  }

  const updateData = {};
  if (payload.phone !== undefined) updateData.phone = payload.phone;
  if (payload.note !== undefined) updateData.note = payload.note;

  await RequestCall.update(updateData, { where: { id } });
  return await RequestCall.findByPk(id);
}

async function deleteRequestCall(id) {
  const requestCall = await RequestCall.findByPk(id);
  if (!requestCall) {
    const e = new Error('Yêu cầu gọi lại không tồn tại');
    e.status = 404;
    throw e;
  }

  await RequestCall.destroy({ where: { id } });
  return { message: 'Yêu cầu gọi lại đã được xóa thành công' };
}

module.exports = { createRequestCall, listRequestCalls, getRequestCall, updateRequestCall, deleteRequestCall };
