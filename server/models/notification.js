const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["movie", "promotion", "payment", "system", "favorite", "comment", "subscription", "new_episode"],
      default: "system",
    },

    // Ưu tiên thông báo
    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
    },

    image: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "/",
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Xóa mềm (soft delete)
    deleted: {
      type: Boolean,
      default: false,
    },

    // Dữ liệu bổ sung tùy loại thông báo
    // VD: { movieId, transactionId, episodeId, ... }
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Compound index để query nhanh
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, deleted: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
