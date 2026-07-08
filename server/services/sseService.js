/**
 * SSE Service - Server-Sent Events Manager
 * Quản lý kết nối SSE cho từng userId để push realtime notification
 */

// Map lưu kết nối SSE: userId (string) → Set<res>
const clients = new Map();

/**
 * Thêm một kết nối SSE mới cho userId
 * @param {string} userId
 * @param {import('express').Response} res
 */
const addClient = (userId, res) => {
  const key = userId.toString();
  if (!clients.has(key)) {
    clients.set(key, new Set());
  }
  clients.get(key).add(res);
  console.log(
    `📡 SSE: User ${key} connected. Total clients: ${getTotalClients()}`,
  );
};

/**
 * Xóa kết nối SSE khi client disconnect
 * @param {string} userId
 * @param {import('express').Response} res
 */
const removeClient = (userId, res) => {
  const key = userId.toString();
  if (clients.has(key)) {
    clients.get(key).delete(res);
    if (clients.get(key).size === 0) {
      clients.delete(key);
    }
  }
  console.log(
    `📡 SSE: User ${key} disconnected. Total clients: ${getTotalClients()}`,
  );
};

/**
 * Gửi event đến tất cả kết nối của một userId
 * @param {string} userId
 * @param {string} eventType - tên event (e.g. "notification", "ping")
 * @param {object} data - data object sẽ được JSON.stringify
 */
const sendToUser = (userId, eventType, data) => {
  const key = userId.toString();
  if (!clients.has(key)) return;

  const message = formatSSEMessage(eventType, data);
  const userClients = clients.get(key);

  userClients.forEach((res) => {
    try {
      res.write(message);
    } catch (err) {
      console.error(`📡 SSE: Error sending to user ${key}:`, err.message);
      userClients.delete(res);
    }
  });
};

/**
 * Broadcast event đến tất cả user đang kết nối
 * @param {string} eventType
 * @param {object} data
 */
const broadcast = (eventType, data) => {
  const message = formatSSEMessage(eventType, data);
  clients.forEach((userClients, userId) => {
    userClients.forEach((res) => {
      try {
        res.write(message);
      } catch (err) {
        console.error(`📡 SSE: Broadcast error for ${userId}:`, err.message);
        userClients.delete(res);
      }
    });
  });
};

/**
 * Format SSE message theo chuẩn SSE protocol
 * @param {string} eventType
 * @param {object} data
 * @returns {string}
 */
const formatSSEMessage = (eventType, data) => {
  const id = Date.now();
  return `id: ${id}\nevent: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
};

/**
 * Ping tất cả clients để giữ kết nối
 */
const pingAll = () => {
  const pingMsg = `: ping\n\n`;
  clients.forEach((userClients) => {
    userClients.forEach((res) => {
      try {
        res.write(pingMsg);
      } catch {
        // silent - sẽ được xử lý ở lần push tiếp theo
      }
    });
  });
};

/**
 * Lấy tổng số client đang kết nối
 * @returns {number}
 */
const getTotalClients = () => {
  let total = 0;
  clients.forEach((set) => (total += set.size));
  return total;
};

// Ping mỗi 30 giây để giữ kết nối không bị timeout
setInterval(pingAll, 30000);

module.exports = {
  addClient,
  removeClient,
  sendToUser,
  broadcast,
  getTotalClients,
};
