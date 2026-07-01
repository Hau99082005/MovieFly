const WatchHistory = require("../models/watch_history");

const getAllWatchHistory = async (req, res) => {
  try {
    const { userId, movieId, episodeId, completed, device_type } = req.query;

    const filter = {};
    if (userId) filter.userId = userId;
    if (movieId) filter.movieId = movieId;
    if (episodeId) filter.episodeId = episodeId;
    if (completed !== undefined) filter.completed = completed === "true";
    if (device_type) filter.device_type = device_type;

    const watchHistory = await WatchHistory.find(filter)
      .populate("userId", "username avatar_url")
      .populate("movieId", "title poster_url")
      .populate("episodeId", "title episodeNumber")
      .sort({ watched_at: -1 });

    return res.status(200).json({
      message: "Watch history retrieved successfully",
      data: watchHistory,
      total: watchHistory.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getWatchHistoryByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, page = 1 } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const watchHistory = await WatchHistory.find({ userId })
      .populate("movieId", "title poster_url type")
      .populate("episodeId", "title episodeNumber")
      .sort({ watched_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await WatchHistory.countDocuments({ userId });

    return res.status(200).json({
      message: "Watch history retrieved successfully",
      data: watchHistory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getContinueWatching = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const watchHistory = await WatchHistory.find({
      userId,
      completed: false,
      progress_sec: { $gt: 0 },
    })
      .populate("movieId", "title poster_url backdrop_url type")
      .populate("episodeId", "title episodeNumber seasonId")
      .sort({ watched_at: -1 })
      .limit(10);

    return res.status(200).json({
      message: "Continue watching retrieved successfully",
      data: watchHistory,
      total: watchHistory.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getWatchHistoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const watchHistory = await WatchHistory.findById(id)
      .populate("userId", "username avatar_url")
      .populate("movieId", "title poster_url")
      .populate("episodeId", "title episodeNumber");

    if (!watchHistory) {
      return res.status(404).json({ message: "Watch history not found" });
    }

    return res.status(200).json({
      message: "Watch history retrieved successfully",
      data: watchHistory,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const createOrUpdateWatchHistory = async (req, res) => {
  try {
    const {
      userId,
      movieId,
      episodeId,
      progress_sec,
      duration_sec,
      completed,
      device_type,
    } = req.body;

    if (!userId || !movieId || !episodeId) {
      return res.status(400).json({
        message: "userId, movieId and episodeId are required",
      });
    }

    const existingHistory = await WatchHistory.findOne({
      userId,
      episodeId,
    });

    if (existingHistory) {
      existingHistory.progress_sec =
        progress_sec || existingHistory.progress_sec;
      existingHistory.duration_sec =
        duration_sec || existingHistory.duration_sec;
      existingHistory.completed =
        completed !== undefined ? completed : existingHistory.completed;
      existingHistory.device_type = device_type || existingHistory.device_type;
      existingHistory.watched_at = Date.now();

      const updatedHistory = await existingHistory.save();

      const populatedHistory = await WatchHistory.findById(updatedHistory._id)
        .populate("userId", "username avatar_url")
        .populate("movieId", "title poster_url")
        .populate("episodeId", "title episodeNumber");

      return res.status(200).json({
        message: "Watch history updated successfully",
        data: populatedHistory,
      });
    }

    const newHistory = new WatchHistory({
      userId,
      movieId,
      episodeId,
      progress_sec: progress_sec || 0,
      duration_sec: duration_sec || 0,
      completed: completed || false,
      device_type: device_type || "web",
      watched_at: Date.now(),
    });

    const savedHistory = await newHistory.save();

    const populatedHistory = await WatchHistory.findById(savedHistory._id)
      .populate("userId", "username avatar_url")
      .populate("movieId", "title poster_url")
      .populate("episodeId", "title episodeNumber");

    return res.status(201).json({
      message: "Watch history created successfully",
      data: populatedHistory,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress_sec, completed } = req.body;

    const watchHistory = await WatchHistory.findById(id);

    if (!watchHistory) {
      return res.status(404).json({ message: "Watch history not found" });
    }

    if (progress_sec !== undefined) {
      watchHistory.progress_sec = progress_sec;
    }

    if (completed !== undefined) {
      watchHistory.completed = completed;
    }

    watchHistory.watched_at = Date.now();

    await watchHistory.save();

    const populatedHistory = await WatchHistory.findById(id)
      .populate("userId", "username avatar_url")
      .populate("movieId", "title poster_url")
      .populate("episodeId", "title episodeNumber");

    return res.status(200).json({
      message: "Progress updated successfully",
      data: populatedHistory,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteWatchHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedHistory = await WatchHistory.findByIdAndDelete(id);

    if (!deletedHistory) {
      return res.status(404).json({ message: "Watch history not found" });
    }

    return res.status(200).json({
      message: "Watch history deleted successfully",
      data: deletedHistory,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const clearWatchHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await WatchHistory.deleteMany({ userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "No watch history found for this user",
      });
    }

    return res.status(200).json({
      message: "Watch history cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getWatchStatistics = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const totalWatched = await WatchHistory.countDocuments({ userId });
    const completedCount = await WatchHistory.countDocuments({
      userId,
      completed: true,
    });
    const inProgressCount = await WatchHistory.countDocuments({
      userId,
      completed: false,
      progress_sec: { $gt: 0 },
    });

    const totalWatchTime = await WatchHistory.aggregate([
      { $match: { userId: require("mongoose").Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$progress_sec" } } },
    ]);

    const deviceStats = await WatchHistory.aggregate([
      { $match: { userId: require("mongoose").Types.ObjectId(userId) } },
      { $group: { _id: "$device_type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json({
      message: "Watch statistics retrieved successfully",
      data: {
        totalWatched,
        completedCount,
        inProgressCount,
        totalWatchTimeSeconds: totalWatchTime[0]?.total || 0,
        totalWatchTimeMinutes: Math.floor((totalWatchTime[0]?.total || 0) / 60),
        totalWatchTimeHours: Math.floor((totalWatchTime[0]?.total || 0) / 3600),
        deviceStats,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getAllWatchHistory,
  getWatchHistoryByUserId,
  getContinueWatching,
  getWatchHistoryById,
  createOrUpdateWatchHistory,
  updateProgress,
  deleteWatchHistory,
  clearWatchHistory,
  getWatchStatistics,
};
