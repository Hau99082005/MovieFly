const Season = require("../models/seasons");
const { saveFileLocally, deleteFileLocally, getFileUrl } = require("../lib/localStorage");

const getAllSeasons = async (req, res) => {
  try {
    const { movieId } = req.query;

    const filter = {};
    if (movieId) filter.movieId = movieId;

    const seasons = await Season.find(filter)
      .populate("movieId")
      .sort({ movieId: 1, seasonNumber: 1 });

    return res.status(200).json({
      message: "Seasons retrieved successfully",
      data: seasons,
      total: seasons.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getSeasonsByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    const seasons = await Season.find({ movieId }).sort({ seasonNumber: 1 });

    return res.status(200).json({
      message: "Seasons retrieved successfully",
      data: seasons,
      total: seasons.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getSeasonById = async (req, res) => {
  try {
    const { id } = req.params;

    const season = await Season.findById(id).populate("movieId");

    if (!season) {
      return res.status(404).json({ message: "Season not found" });
    }

    return res.status(200).json({
      message: "Season retrieved successfully",
      data: season,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const createSeason = async (req, res) => {
  try {
    
    const { movieId, seasonNumber, title, synopsis, releaseDate } = req.body;

    if (!movieId || !seasonNumber || !title) {
      return res
        .status(400)
        .json({ 
          message: "movieId, seasonNumber and title are required",
          received: { movieId, seasonNumber, title }
        });
    }

    const existingSeason = await Season.findOne({ movieId, seasonNumber });

    if (existingSeason) {
      return res
        .status(409)
        .json({ message: "Season number already exists for this movie" });
    }

    const seasonData = {
      movieId,
      seasonNumber,
      title,
      synopsis: synopsis || "",
      releaseDate: releaseDate || null,
    };

    if (req.file) {
      const posterResult = await saveFileLocally(
        req.file.buffer,
        "seasons/posters",
        req.file.originalname,
      );
      seasonData.poster_url = getFileUrl(posterResult.filePath);
      seasonData.poster_path = posterResult.filePath;
    }

    const newSeason = new Season(seasonData);

    const savedSeason = await newSeason.save();

    const populatedSeason = await Season.findById(savedSeason._id).populate(
      "movieId",
    );

    return res.status(201).json({
      message: "Season created successfully",
      data: populatedSeason,
    });
  } catch (error) {
    console.error("Create season error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updateSeason = async (req, res) => {
  try {
    const { id } = req.params;
    const { movieId, seasonNumber, title, synopsis, releaseDate } = req.body;

    const season = await Season.findById(id);

    if (!season) {
      return res.status(404).json({ message: "Season not found" });
    }

    if (movieId && seasonNumber) {
      const existingSeason = await Season.findOne({
        movieId: movieId || season.movieId,
        seasonNumber: seasonNumber || season.seasonNumber,
        _id: { $ne: id },
      });

      if (existingSeason) {
        return res
          .status(409)
          .json({ message: "Season number already exists for this movie" });
      }
    }

    const updateData = {};
    if (movieId !== undefined) updateData.movieId = movieId;
    if (seasonNumber !== undefined) updateData.seasonNumber = seasonNumber;
    if (title !== undefined) updateData.title = title;
    if (synopsis !== undefined) updateData.synopsis = synopsis;
    if (releaseDate !== undefined) updateData.releaseDate = releaseDate;

    if (req.file) {
      if (season.poster_path) {
        await deleteFileLocally(season.poster_path);
      }
      const posterResult = await saveFileLocally(
        req.file.buffer,
        "seasons/posters",
        req.file.originalname,
      );
      updateData.poster_url = getFileUrl(posterResult.filePath);
      updateData.poster_path = posterResult.filePath;
    }

    const updatedSeason = await Season.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("movieId");

    return res.status(200).json({
      message: "Season updated successfully",
      data: updatedSeason,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteSeason = async (req, res) => {
  try {
    const { id } = req.params;

    const season = await Season.findById(id);

    if (!season) {
      return res.status(404).json({ message: "Season not found" });
    }

    if (season.poster_path) {
      await deleteFileLocally(season.poster_path);
    }

    await Season.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Season deleted successfully",
      data: season,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteSeasonsByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    const seasons = await Season.find({ movieId });

    if (seasons.length === 0) {
      return res
        .status(404)
        .json({ message: "No seasons found for this movie" });
    }

    const deletePromises = seasons.map((season) => {
      if (season.poster_path) {
        return deleteFileLocally(season.poster_path);
      }
      return Promise.resolve();
    });

    await Promise.all(deletePromises);

    const result = await Season.deleteMany({ movieId });

    return res.status(200).json({
      message: "All seasons deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getAllSeasons,
  getSeasonsByMovieId,
  getSeasonById,
  createSeason,
  updateSeason,
  deleteSeason,
  deleteSeasonsByMovieId,
};
