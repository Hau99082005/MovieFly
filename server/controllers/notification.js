const Notification = require("../models/notification");
const User = require("../models/user");
const sseService = require("../services/sseService");

// ─── Helpers ─────────────────────────────────────────────────────────────────

const canAccessNotification = (req, targetUserId) => {
  if (!req.user) return false;
  if (req.user.role === "admin") return true;
  if (!targetUserId) return false;
  return req.user._id.toString() === targetUserId.toString();
};

// ─── SSE Stream ──────────────────────────────────────────────────────────────

/**
 * GET /api/notifications/stream
 * User connect SSE để nhận thông báo realtime.
 * Yêu cầu: authMiddleware
 */
const streamNotifications = (req, res) => {
  const userId = req.user._id.toString();

  // Thiết lập SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Quan trọng cho Nginx
  res.flushHeaders();

  // Gửi event "connected" để client biết kết nối thành công
  res.write(
    `event: connected\ndata: ${JSON.stringify({ userId, timestamp: new Date().toISOString() })}\n\n`,
  );

  // Đăng ký kết nối
  sseService.addClient(userId, res);

  // Cleanup khi client disconnect
  req.on("close", () => {
    sseService.removeClient(userId, res);
  });

  req.on("error", () => {
    sseService.removeClient(userId, res);
  });
};

// ─── Create ──────────────────────────────────────────────────────────────────

/**
 * POST /api/notifications
 * Tạo notification (Admin only).
 * Sau khi tạo, push realtime đến user qua SSE.
 */
const createNotification = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can create notifications",
      });
    }

    const { userId, title, message, type, link, image, broadcast, priority, metadata } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "title và message là bắt buộc",
      });
    }

    // ── Broadcast: gửi cho tất cả user active ──
    if (broadcast) {
      const users = await User.find({ status: "active" }).select("_id");

      if (!users.length) {
        return res.status(404).json({
          success: false,
          message: "Không có user active nào",
        });
      }

      const notifications = users.map((user) => ({
        userId: user._id,
        title,
        message,
        type: type || "system",
        link: link || "/",
        image: image || "",
        priority: priority || "normal",
        metadata: metadata || {},
      }));

      const createdNotifications = await Notification.insertMany(notifications);

      // Push realtime cho tất cả user đang online
      const notifData = {
        _id: null, // sẽ khác nhau theo user
        title,
        message,
        type: type || "system",
        link: link || "/",
        image: image || "",
        priority: priority || "normal",
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      sseService.broadcast("notification", notifData);

      return res.status(201).json({
        success: true,
        message: "Broadcast notification đã được tạo và gửi realtime",
        count: createdNotifications.length,
        data: createdNotifications,
      });
    }

    // ── Single user ──
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId là bắt buộc khi không phải broadcast",
      });
    }

    const notification = await Notification.create({
      userId,
      title,
      message,
      type: type || "system",
      link: link || "/",
      image: image || "",
      priority: priority || "normal",
      metadata: metadata || {},
    });

    // Push realtime đến user
    sseService.sendToUser(userId, "notification", {
      _id: notification._id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      link: notification.link,
      image: notification.image,
      priority: notification.priority,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      metadata: notification.metadata,
    });

    return res.status(201).json({
      success: true,
      message: "Notification đã được tạo và gửi realtime",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * GET /api/notifications/user/:userId
 * Lấy danh sách notification của user (có pagination + filter).
 * User chỉ xem được của mình; Admin xem được của ai cũng được.
 */
const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, type, isRead } = req.query;

    if (!canAccessNotification(req, userId)) {
      return res.status(403).json({
        success: false,
        message: "Bạn chỉ có thể xem thông báo của mình",
      });
    }

    const filter = { userId, deleted: false };
    if (type) filter.type = type;
    if (isRead !== undefined && isRead !== "")
      filter.isRead = isRead === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Notification.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        hasMore: skip + notifications.length < total,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── Mark as Read ─────────────────────────────────────────────────────────────

/**
 * PATCH /api/notifications/:id/read
 * Đánh dấu một notification đã đọc.
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy notification",
      });
    }

    if (!canAccessNotification(req, notification.userId)) {
      return res.status(403).json({
        success: false,
        message: "Bạn chỉ có thể quản lý thông báo của mình",
      });
    }

    const updated = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Đã đánh dấu là đã đọc",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PATCH /api/notifications/read-all/:userId
 * Đánh dấu tất cả notification của user là đã đọc.
 */
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!canAccessNotification(req, userId)) {
      return res.status(403).json({
        success: false,
        message: "Bạn chỉ có thể quản lý thông báo của mình",
      });
    }

    const result = await Notification.updateMany(
      { userId, isRead: false, deleted: false },
      { isRead: true },
    );

    return res.status(200).json({
      success: true,
      message: "Đã đánh dấu tất cả là đã đọc",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * DELETE /api/notifications/:id
 * Xóa mềm một notification (user hoặc admin).
 */
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy notification",
      });
    }

    if (!canAccessNotification(req, notification.userId)) {
      return res.status(403).json({
        success: false,
        message: "Bạn chỉ có thể quản lý thông báo của mình",
      });
    }

    // Soft delete
    await Notification.findByIdAndUpdate(id, { deleted: true });

    return res.status(200).json({
      success: true,
      message: "Đã xóa notification",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE /api/notifications/all/:userId
 * Xóa mềm toàn bộ notification của user.
 */
const deleteAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!canAccessNotification(req, userId)) {
      return res.status(403).json({
        success: false,
        message: "Bạn chỉ có thể quản lý thông báo của mình",
      });
    }

    const result = await Notification.updateMany(
      { userId, deleted: false },
      { deleted: true },
    );

    return res.status(200).json({
      success: true,
      message: "Đã xóa tất cả notification",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── Count ───────────────────────────────────────────────────────────────────

/**
 * GET /api/notifications/unread/:userId
 * Đếm số notification chưa đọc.
 */
const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!canAccessNotification(req, userId)) {
      return res.status(403).json({
        success: false,
        message: "Bạn chỉ có thể xem thông báo của mình",
      });
    }

    const count = await Notification.countDocuments({
      userId,
      isRead: false,
      deleted: false,
    });

    return res.status(200).json({
      success: true,
      unread: count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── Utility: Internal trigger (gọi từ các controller khác) ──────────────────

/**
 * Tạo notification nội bộ và push realtime (không qua HTTP).
 * Dùng bởi controllers khác (payment, comment, v.v.)
 * @param {object} params
 * @param {string} params.userId
 * @param {string} params.title
 * @param {string} params.message
 * @param {'movie'|'promotion'|'payment'|'system'|'favorite'|'comment'|'subscription'|'new_episode'} params.type
 * @param {string} [params.link]
 * @param {string} [params.image]
 * @param {'low'|'normal'|'high'} [params.priority]
 * @param {object} [params.metadata]
 */
const triggerNotification = async ({
  userId,
  title,
  message,
  type = "system",
  link = "/",
  image = "",
  priority = "normal",
  metadata = {},
}) => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      link,
      image,
      priority,
      metadata,
    });

    sseService.sendToUser(userId.toString(), "notification", {
      _id: notification._id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      link: notification.link,
      image: notification.image,
      priority: notification.priority,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      metadata: notification.metadata,
    });

    return notification;
  } catch (error) {
    console.error("❌ triggerNotification error:", error.message);
    return null;
  }
};

module.exports = {
  streamNotifications,
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
  triggerNotification,
};
