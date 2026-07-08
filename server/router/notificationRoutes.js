const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const {
  streamNotifications,
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
} = require("../controllers/notification");

// Tất cả routes cần auth (trừ SSE stream tự xử lý)
router.use(authMiddleware);

// ─── SSE Realtime Stream ─────────────────────────────────
// Phải đặt TRƯỚC các route có param để không bị conflict
router.get("/stream", streamNotifications);

// ─── Count ───────────────────────────────────────────────
// Đặt trước /:userId để tránh conflict param
router.get("/unread/:userId", getUnreadCount);

// ─── CRUD ────────────────────────────────────────────────
// Admin tạo notification
router.post("/", adminMiddleware, createNotification);

// User lấy danh sách (hỗ trợ ?page=&limit=&type=&isRead=)
// KHÔNG yêu cầu adminMiddleware — user xem thông báo của mình
router.get("/user/:userId", getNotifications);

// Đánh dấu đã đọc một notification
router.patch("/:id/read", markAsRead);

// Đánh dấu tất cả đã đọc
router.patch("/read-all/:userId", markAllAsRead);

// Xóa một notification (user hoặc admin)
router.delete("/:id", deleteNotification);

// Xóa toàn bộ notification của user
router.delete("/all/:userId", deleteAllNotifications);

module.exports = router;
