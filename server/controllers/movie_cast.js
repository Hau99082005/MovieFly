const MovieCast = require("../models/movie_cast");

const getAllMovieCasts = async (req, res) => {
  try {
    const movieCasts = await MovieCast.find({})
      .populate("movieId")
      .populate("personId")
      .sort({ sortOrder: 1 });

    return res.status(200).json({
      message: "Movie casts retrieved successfully",
      data: movieCasts,
      total: movieCasts.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getMovieCastById = async (req, res) => {
  try {
    const { id } = req.params;

    const movieCast = await MovieCast.findById(id)
      .populate("movieId")
      .populate("personId");

    if (!movieCast) {
      return res.status(404).json({ message: "Movie cast not found" });
    }

    return res.status(200).json({
      message: "Movie cast retrieved successfully",
      data: movieCast,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getMovieCastsByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;

    const movieCasts = await MovieCast.find({ movieId })
      .populate("personId")
      .sort({ sortOrder: 1 });

    return res.status(200).json({
      message: "Movie casts retrieved successfully",
      data: movieCasts,
      total: movieCasts.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getMovieCastsByPersonId = async (req, res) => {
  try {
    const { personId } = req.params;

    const movieCasts = await MovieCast.find({ personId })
      .populate("movieId")
      .sort({ sortOrder: 1 });

    return res.status(200).json({
      message: "Movie casts retrieved successfully",
      data: movieCasts,
      total: movieCasts.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getMovieCastsByRole = async (req, res) => {
  try {
    const { movieId, role } = req.params;

    if (!["actor", "director", "producer", "writer"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Must be: actor, director, producer, or writer",
      });
    }

    const movieCasts = await MovieCast.find({ movieId, role })
      .populate("personId")
      .sort({ sortOrder: 1 });

    return res.status(200).json({
      message: `Movie ${role}s retrieved successfully`,
      data: movieCasts,
      total: movieCasts.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const createMovieCast = async (req, res) => {
  try {
    const { movieId, personId, role, characterName, sortOrder } = req.body;

    if (!movieId || !personId || !role || sortOrder === undefined) {
      return res.status(400).json({
        message: "movieId, personId, role and sortOrder are required",
      });
    }

    if (!["actor", "director", "producer", "writer"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Must be: actor, director, producer, or writer",
      });
    }

    if (role === "actor" && !characterName) {
      return res.status(400).json({
        message: "characterName is required for actor role",
      });
    }

    const existingCast = await MovieCast.findOne({
      movieId,
      personId,
      role,
      characterName: characterName || null,
    });

    if (existingCast) {
      return res.status(409).json({
        message:
          "This person is already assigned to this movie with the same role",
      });
    }

    const newMovieCast = new MovieCast({
      movieId,
      personId,
      role,
      characterName: role === "actor" ? characterName : undefined,
      sortOrder,
    });

    await newMovieCast.save();

    const populatedMovieCast = await MovieCast.findById(newMovieCast._id)
      .populate("movieId")
      .populate("personId");

    return res.status(201).json({
      message: "Movie cast created successfully",
      data: populatedMovieCast,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const bulkCreateMovieCasts = async (req, res) => {
  try {
    const { movieId, casts } = req.body;

    if (!movieId || !casts || !Array.isArray(casts) || casts.length === 0) {
      return res.status(400).json({
        message: "movieId and casts array are required",
      });
    }

    const movieCastsToCreate = casts.map((cast) => ({
      movieId,
      personId: cast.personId,
      role: cast.role,
      characterName: cast.role === "actor" ? cast.characterName : undefined,
      sortOrder: cast.sortOrder,
    }));

    const createdCasts = await MovieCast.insertMany(movieCastsToCreate);

    const populatedCasts = await MovieCast.find({
      _id: { $in: createdCasts.map((c) => c._id) },
    })
      .populate("movieId")
      .populate("personId")
      .sort({ sortOrder: 1 });

    return res.status(201).json({
      message: "Movie casts created successfully",
      data: populatedCasts,
      total: populatedCasts.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updateMovieCast = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Movie cast ID is required" });
    }

    const movieCast = await MovieCast.findById(id);

    if (!movieCast) {
      return res.status(404).json({ message: "Movie cast not found" });
    }

    const { role, characterName, sortOrder } = req.body;

    if (role !== undefined) {
      if (!["actor", "director", "producer", "writer"].includes(role)) {
        return res.status(400).json({
          message:
            "Invalid role. Must be: actor, director, producer, or writer",
        });
      }

      if (role === "actor" && !characterName && !movieCast.characterName) {
        return res.status(400).json({
          message: "characterName is required for actor role",
        });
      }

      movieCast.role = role;

      if (role !== "actor") {
        movieCast.characterName = undefined;
      }
    }

    if (characterName !== undefined) {
      const currentRole = role !== undefined ? role : movieCast.role;
      if (currentRole === "actor") {
        movieCast.characterName = characterName;
      } else {
        return res.status(400).json({
          message: "characterName can only be set for actor role",
        });
      }
    }

    if (sortOrder !== undefined) {
      movieCast.sortOrder = sortOrder;
    }

    await movieCast.save();

    const populatedMovieCast = await MovieCast.findById(id)
      .populate("movieId")
      .populate("personId");

    return res.status(200).json({
      message: "Movie cast updated successfully",
      data: populatedMovieCast,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteMovieCast = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Movie cast ID is required" });
    }

    const deletedMovieCast = await MovieCast.findByIdAndDelete(id);

    if (!deletedMovieCast) {
      return res.status(404).json({ message: "Movie cast not found" });
    }

    return res.status(200).json({
      message: "Movie cast deleted successfully",
      data: deletedMovieCast,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteMovieCastsByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;

    const result = await MovieCast.deleteMany({ movieId });

    return res.status(200).json({
      message: "Movie casts deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getAllMovieCasts,
  getMovieCastById,
  getMovieCastsByMovieId,
  getMovieCastsByPersonId,
  getMovieCastsByRole,
  createMovieCast,
  bulkCreateMovieCasts,
  updateMovieCast,
  deleteMovieCast,
  deleteMovieCastsByMovieId,
};
