const MovieGenre = require("../models/moviegenres");

const getAllMovieGenres = async (req, res) => {
  try {
    const movieGenres = await MovieGenre.find({})
      .populate("movieId")
      .populate("genreId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Movie genres retrieved successfully",
      data: movieGenres,
      total: movieGenres.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getMovieGenresByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    const movieGenres = await MovieGenre.find({ movieId })
      .populate("genreId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Movie genres retrieved successfully",
      data: movieGenres,
      total: movieGenres.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getMovieGenresByGenreId = async (req, res) => {
  try {
    const { genreId } = req.params;

    if (!genreId) {
      return res.status(400).json({ message: "Genre ID is required" });
    }

    const movieGenres = await MovieGenre.find({ genreId })
      .populate("movieId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Movies by genre retrieved successfully",
      data: movieGenres,
      total: movieGenres.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getMovieGenreById = async (req, res) => {
  try {
    const { id } = req.params;

    const movieGenre = await MovieGenre.findById(id)
      .populate("movieId")
      .populate("genreId");

    if (!movieGenre) {
      return res.status(404).json({ message: "Movie genre not found" });
    }

    return res.status(200).json({
      message: "Movie genre retrieved successfully",
      data: movieGenre,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const createMovieGenres = async (req, res) => {
  try {
    const { movieId, genreId } = req.body;

    if (!movieId || !genreId) {
      return res.status(400).json({ message: "Movie ID and Genre ID are required" });
    }

    const existingRelation = await MovieGenre.findOne({ movieId, genreId });

    if (existingRelation) {
      return res.status(409).json({ message: "This movie-genre relation already exists" });
    }

    const newMovieGenre = new MovieGenre({
      movieId,
      genreId,
    });

    const savedMovieGenre = await newMovieGenre.save();

    const populatedMovieGenre = await MovieGenre.findById(savedMovieGenre._id)
      .populate("movieId")
      .populate("genreId");

    return res.status(201).json({
      message: "Movie genre created successfully",
      data: populatedMovieGenre,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const createMultipleMovieGenres = async (req, res) => {
  try {
    const { movieId, genreIds } = req.body;

    if (!movieId || !genreIds || !Array.isArray(genreIds) || genreIds.length === 0) {
      return res.status(400).json({ message: "Movie ID and Genre IDs array are required" });
    }

    const existingRelations = await MovieGenre.find({
      movieId,
      genreId: { $in: genreIds },
    });

    const existingGenreIds = existingRelations.map(rel => rel.genreId.toString());
    const newGenreIds = genreIds.filter(id => !existingGenreIds.includes(id));

    if (newGenreIds.length === 0) {
      return res.status(409).json({ message: "All genres already assigned to this movie" });
    }

    const newMovieGenres = newGenreIds.map(genreId => ({
      movieId,
      genreId,
    }));

    const savedMovieGenres = await MovieGenre.insertMany(newMovieGenres);

    const populatedMovieGenres = await MovieGenre.find({
      _id: { $in: savedMovieGenres.map(mg => mg._id) },
    })
      .populate("movieId")
      .populate("genreId");

    return res.status(201).json({
      message: "Movie genres created successfully",
      data: populatedMovieGenres,
      created: newGenreIds.length,
      skipped: existingGenreIds.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updateMovieGenres = async (req, res) => {
  try {
    const { id } = req.params;
    const { movieId, genreId } = req.body;

    const movieGenre = await MovieGenre.findById(id);

    if (!movieGenre) {
      return res.status(404).json({ message: "Movie genre not found" });
    }

    if (movieId || genreId) {
      const checkDuplicate = await MovieGenre.findOne({
        movieId: movieId || movieGenre.movieId,
        genreId: genreId || movieGenre.genreId,
        _id: { $ne: id },
      });

      if (checkDuplicate) {
        return res.status(409).json({ message: "This movie-genre relation already exists" });
      }
    }

    const updateData = {};
    if (movieId) updateData.movieId = movieId;
    if (genreId) updateData.genreId = genreId;

    const updatedMovieGenre = await MovieGenre.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("movieId")
      .populate("genreId");

    return res.status(200).json({
      message: "Movie genre updated successfully",
      data: updatedMovieGenre,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteMovieGenres = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMovieGenre = await MovieGenre.findByIdAndDelete(id);

    if (!deletedMovieGenre) {
      return res.status(404).json({ message: "Movie genre not found" });
    }

    return res.status(200).json({
      message: "Movie genre deleted successfully",
      data: deletedMovieGenre,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteMovieGenresByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    const result = await MovieGenre.deleteMany({ movieId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No genres found for this movie" });
    }

    return res.status(200).json({
      message: "All movie genres deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getAllMovieGenres,
  getMovieGenresByMovieId,
  getMovieGenresByGenreId,
  getMovieGenreById,
  createMovieGenres,
  createMultipleMovieGenres,
  updateMovieGenres,
  deleteMovieGenres,
  deleteMovieGenresByMovieId,
};
