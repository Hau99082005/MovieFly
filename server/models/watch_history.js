const mongoose = require("mongoose");

const watchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    episodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Episode",
      required: true,
    },
    progress_sec: {
      type: Number,
      default: 0,
    },
    duration_sec: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    device_type: {
      type: String,
      enum: ["web", "mobile", "desktop", "tv"],
      default: "web",
    },
    watched_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);
module.exports = WatchHistory;
