const Rating = require("../models/ratings");

const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({}).sort({ createdAt: -1 });
    if (!ratings) {
      return res.status(400).json({ message: "Bad request" });
    } else {
      return res
        .status(200)
        .json({ message: "Ratings retrieved successfully!", ratings: ratings });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getRatingById = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await Rating.findById(id);
    if (!rating) {
      return res.status(400).json({ message: "Bad request" });
    } else {
      return res
        .status(200)
        .json({ message: "Rating retrieved successfully!", rating: rating });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const createRating = async (req, res) => {
  try {
    const { userId, movieId, score } = req.body;
    const newRating = new Rating({ userId, movieId, score });
    if (!newRating) {
      return res.status(400).json({ message: "Bad request!" });
    } else {
      await newRating.save();
      return res
        .status(201)
        .json({ message: "Rating created successfully!", rating: newRating });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Bad request!" });
    }
    const updatingRating = await Rating.findByIdAndUpdate(
      id,
      {
        userId: req.body.userId,
        movieId: req.body.movieId,
        score: req.body.score,
      },
      { new: true },
    );
    if (!updatingRating) {
      return res.status(400).json({ message: "Bad request!" });
    } else {
      return res.status(200).json({
        message: "Rating updated successfully!",
        rating: updatingRating,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const deletingRating = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Bad request!" });
    }
    const deletingRating = await Rating.findByIdAndDelete(id);
    if (!deletingRating) {
      return res.status(400).json({ message: "Bad request!" });
    } else {
      return res.status(200).json({
        message: "Rating deleted successfully!",
        rating: deletingRating,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  getAllRatings,
  getRatingById,
  createRating,
  updateRating,
  deletingRating,
};
