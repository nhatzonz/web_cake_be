const requestCallService = require('../services/requestCallService');

async function createRequestCall(req, res) {
  try {
    const requestCall = await requestCallService.createRequestCall(req.body);
    return res.status(201).json(requestCall);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || 'Lỗi server khi tạo yêu cầu gọi lại' });
  }
}

async function listRequestCalls(req, res) {
  try {
    const requestCalls = await requestCallService.listRequestCalls();
    return res.json(requestCalls);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || 'Lỗi server khi lấy danh sách yêu cầu gọi lại' });
  }
}

async function getRequestCall(req, res) {
  try {
    const requestCall = await requestCallService.getRequestCall(req.params.id);
    return res.json(requestCall);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || 'Lỗi server khi lấy yêu cầu gọi lại' });
  }
}

async function updateRequestCall(req, res) {
  try {
    const requestCall = await requestCallService.updateRequestCall(req.params.id, req.body);
    return res.json(requestCall);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || 'Lỗi server khi cập nhật yêu cầu gọi lại' });
  }
}

async function deleteRequestCall(req, res) {
  try {
    const result = await requestCallService.deleteRequestCall(req.params.id);
    return res.json(result);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || 'Lỗi server khi xóa yêu cầu gọi lại' });
  }
}

module.exports = {
  createRequestCall,
  listRequestCalls,
  getRequestCall,
  updateRequestCall,
  deleteRequestCall,
};
