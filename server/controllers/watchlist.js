const Watchlist = require("../models/watchlist");

const getWatchlist = async (req, res) => {
  try {
    const userId = req.query.userId || req.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const watchlistItems = await Watchlist.find({ userId })
      .populate("movieId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Watchlist items retrieved successfully",
      data: watchlistItems,
      total: watchlistItems.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getWatchlistById = async (req, res) => {
  try {
    const { id } = req.params;

    const watchlistItem = await Watchlist.findById(id).populate("movieId");

    if (!watchlistItem) {
      return res.status(404).json({ message: "Watchlist item not found" });
    }

    return res.status(200).json({
      message: "Watchlist item retrieved successfully",
      data: watchlistItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const addToWatchlist = async (req, res) => {
  try {
    const { movieId, userId } = req.body;
    const userIdToUse = userId || req.userId;

    if (!movieId || !userIdToUse) {
      return res
        .status(400)
        .json({ message: "User ID and Movie ID are required" });
    }

    const existingItem = await Watchlist.findOne({
      userId: userIdToUse,
      movieId: movieId,
    });

    if (existingItem) {
      return res.status(409).json({ message: "Movie already in watchlist" });
    }

    const newWatchlistItem = new Watchlist({
      userId: userIdToUse,
      movieId: movieId,
    });

    const savedItem = await newWatchlistItem.save();
    const populatedItem = await Watchlist.findById(savedItem._id).populate(
      "movieId",
    );

    return res.status(201).json({
      message: "Movie added to watchlist successfully",
      data: populatedItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const { movieId, userId } = req.body;
    const userIdToUse = userId || req.userId;

    if (!movieId || !userIdToUse) {
      return res
        .status(400)
        .json({ message: "User ID and Movie ID are required" });
    }

    const deletedItem = await Watchlist.findOneAndDelete({
      userId: userIdToUse,
      movieId: movieId,
    });

    if (!deletedItem) {
      return res.status(404).json({ message: "Movie not found in watchlist" });
    }

    return res.status(200).json({
      message: "Movie removed from watchlist successfully",
      data: deletedItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const clearWatchlist = async (req, res) => {
  try {
    const userId = req.body.userId || req.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await Watchlist.deleteMany({ userId: userId });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No watchlist items found for this user" });
    }

    return res.status(200).json({
      message: "Watchlist cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getWatchlistCount = async (req, res) => {
  try {
    const userId = req.query.userId || req.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const count = await Watchlist.countDocuments({ userId: userId });

    return res.status(200).json({
      message: "Watchlist count retrieved successfully",
      count: count,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const checkInWatchlist = async (req, res) => {
  try {
    const { movieId, userId } = req.query;
    const userIdToUse = userId || req.userId;

    if (!movieId || !userIdToUse) {
      return res
        .status(400)
        .json({ message: "User ID and Movie ID are required" });
    }

    const existingItem = await Watchlist.findOne({
      userId: userIdToUse,
      movieId: movieId,
    });

    return res.status(200).json({
      message: "Check completed",
      inWatchlist: !!existingItem,
      data: existingItem || null,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getWatchlist,
  getWatchlistById,
  addToWatchlist,
  removeFromWatchlist,
  clearWatchlist,
  getWatchlistCount,
  checkInWatchlist,
};
