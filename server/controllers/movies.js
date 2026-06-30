const Movies = require("../models/movies");
const { uploadToBunny, uploadLargeFileToBunny, deleteFromBunny } = require("../lib/bunnyService");
const { getVideoDuration } = require("../lib/videoUtils");

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const getAllMovies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      is_featured,
      is_free,
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (is_featured !== undefined) filter.is_featured = is_featured === "true";
    if (is_free !== undefined) filter.is_free = is_free === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const movies = await Movies.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Movies.countDocuments(filter);

    return res.status(200).json({
      message: "Movies retrieved successfully",
      data: movies,
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

const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movies.findById(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.status(200).json({
      message: "Movie retrieved successfully",
      data: movie,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const createMovie = async (req, res) => {
  try {
    const {
      title,
      original_title,
      slug,
      type,
      status,
      synopsis,
      tagline,
      release_date,
      country_code,
      language,
      duration_min,
      rating,
      imdb_id,
      imdb_score,
      is_featured,
      is_free,
    } = req.body;

    if (!title || !original_title) {
      return res
        .status(400)
        .json({ message: "Title and original_title are required" });
    }

    const generatedSlug = slug || generateSlug(title);

    const existingMovie = await Movies.findOne({ slug: generatedSlug });
    if (existingMovie) {
      return res
        .status(409)
        .json({ message: "Movie with the same slug already exists" });
    }

    const movieData = {
      title,
      original_title,
      slug: generatedSlug,
      type: type || "movie",
      status: status || "draft",
      synopsis: synopsis || "",
      tagline: tagline || "",
      release_date: release_date || null,
      country_code: country_code || "",
      language: language || "",
      duration_min: duration_min || 0,
      rating: rating || 0,
      imdb_id: imdb_id || "",
      imdb_score: imdb_score || 0,
      is_featured: is_featured || false,
      is_free: is_free || false,
    };

    const uploadPromises = [];

    if (req.files) {
      if (req.files.poster) {
        uploadPromises.push(
          uploadToBunny(
            req.files.poster[0].buffer,
            req.files.poster[0].originalname,
            "movies/posters"
          ).then(result => ({
            field: "poster",
            url: result.cdnUrl,
            path: result.filePath,
            zone: result.storageZone,
          }))
        );
      }

      if (req.files.backdrop) {
        uploadPromises.push(
          uploadToBunny(
            req.files.backdrop[0].buffer,
            req.files.backdrop[0].originalname,
            "movies/backdrops"
          ).then(result => ({
            field: "backdrop",
            url: result.cdnUrl,
            path: result.filePath,
            zone: result.storageZone,
          }))
        );
      }

      if (req.files.trailer) {
        const trailerBuffer = req.files.trailer[0].buffer;
        
        uploadPromises.push(
          Promise.all([
            uploadLargeFileToBunny(
              trailerBuffer,
              req.files.trailer[0].originalname,
              "movies/trailers"
            ),
            getVideoDuration(trailerBuffer).catch(() => 0)
          ]).then(([uploadResult, duration]) => ({
            field: "trailer",
            url: uploadResult.cdnUrl,
            path: uploadResult.filePath,
            zone: uploadResult.storageZone,
            duration: duration,
          }))
        );
      }
    }

    const uploadResults = await Promise.all(uploadPromises);

    uploadResults.forEach(result => {
      if (result.field === "poster") {
        movieData.poster_url = result.url;
        movieData.poster_path = result.path;
        movieData.poster_storage_zone = result.zone;
      } else if (result.field === "backdrop") {
        movieData.backdrop_url = result.url;
        movieData.backdrop_path = result.path;
        movieData.backdrop_storage_zone = result.zone;
      } else if (result.field === "trailer") {
        movieData.trailer_url = result.url;
        movieData.trailer_path = result.path;
        movieData.trailer_storage_zone = result.zone;
        if (result.duration && result.duration > 0) {
          movieData.duration_min = result.duration;
        }
      }
    });

    const newMovie = new Movies(movieData);
    await newMovie.save();

    return res.status(201).json({
      message: "Movie created successfully",
      data: newMovie,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movies.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const {
      title,
      original_title,
      slug,
      type,
      status,
      synopsis,
      tagline,
      release_date,
      country_code,
      language,
      duration_min,
      rating,
      imdb_id,
      imdb_score,
      is_featured,
      is_free,
    } = req.body;

    const updateData = {};

    if (title) {
      updateData.title = title;
      updateData.slug = slug || generateSlug(title);
    } else if (slug) {
      updateData.slug = slug;
    }

    if (updateData.slug && updateData.slug !== movie.slug) {
      const existingSlug = await Movies.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      });
      if (existingSlug) {
        return res.status(409).json({ message: "Slug already exists" });
      }
    }

    if (original_title !== undefined)
      updateData.original_title = original_title;
    if (type !== undefined) updateData.type = type;
    if (status !== undefined) updateData.status = status;
    if (synopsis !== undefined) updateData.synopsis = synopsis;
    if (tagline !== undefined) updateData.tagline = tagline;
    if (release_date !== undefined) updateData.release_date = release_date;
    if (country_code !== undefined) updateData.country_code = country_code;
    if (language !== undefined) updateData.language = language;
    if (duration_min !== undefined) updateData.duration_min = duration_min;
    if (rating !== undefined) updateData.rating = rating;
    if (imdb_id !== undefined) updateData.imdb_id = imdb_id;
    if (imdb_score !== undefined) updateData.imdb_score = imdb_score;
    if (is_featured !== undefined) updateData.is_featured = is_featured;
    if (is_free !== undefined) updateData.is_free = is_free;

    const uploadPromises = [];
    const deletePromises = [];

    if (req.files) {
      if (req.files.poster) {
        if (movie.poster_path) {
          deletePromises.push(
            deleteFromBunny(movie.poster_path, movie.poster_storage_zone)
          );
        }
        uploadPromises.push(
          uploadToBunny(
            req.files.poster[0].buffer,
            req.files.poster[0].originalname,
            "movies/posters"
          ).then(result => ({
            field: "poster",
            url: result.cdnUrl,
            path: result.filePath,
            zone: result.storageZone,
          }))
        );
      }

      if (req.files.backdrop) {
        if (movie.backdrop_path) {
          deletePromises.push(
            deleteFromBunny(movie.backdrop_path, movie.backdrop_storage_zone)
          );
        }
        uploadPromises.push(
          uploadToBunny(
            req.files.backdrop[0].buffer,
            req.files.backdrop[0].originalname,
            "movies/backdrops"
          ).then(result => ({
            field: "backdrop",
            url: result.cdnUrl,
            path: result.filePath,
            zone: result.storageZone,
          }))
        );
      }

      if (req.files.trailer) {
        if (movie.trailer_path) {
          deletePromises.push(
            deleteFromBunny(movie.trailer_path, movie.trailer_storage_zone)
          );
        }
        
        const trailerBuffer = req.files.trailer[0].buffer;
        
        uploadPromises.push(
          Promise.all([
            uploadLargeFileToBunny(
              trailerBuffer,
              req.files.trailer[0].originalname,
              "movies/trailers"
            ),
            getVideoDuration(trailerBuffer).catch(() => 0)
          ]).then(([uploadResult, duration]) => ({
            field: "trailer",
            url: uploadResult.cdnUrl,
            path: uploadResult.filePath,
            zone: uploadResult.storageZone,
            duration: duration,
          }))
        );
      }
    }

    await Promise.all(deletePromises);

    const uploadResults = await Promise.all(uploadPromises);

    uploadResults.forEach(result => {
      if (result.field === "poster") {
        updateData.poster_url = result.url;
        updateData.poster_path = result.path;
        updateData.poster_storage_zone = result.zone;
      } else if (result.field === "backdrop") {
        updateData.backdrop_url = result.url;
        updateData.backdrop_path = result.path;
        updateData.backdrop_storage_zone = result.zone;
      } else if (result.field === "trailer") {
        updateData.trailer_url = result.url;
        updateData.trailer_path = result.path;
        updateData.trailer_storage_zone = result.zone;
        if (result.duration && result.duration > 0) {
          updateData.duration_min = result.duration;
        }
      }
    });

    const updatedMovie = await Movies.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "Movie updated successfully",
      data: updatedMovie,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movies.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    if (movie.poster_path) {
      await deleteFromBunny(movie.poster_path, movie.poster_storage_zone);
    }

    if (movie.backdrop_path) {
      await deleteFromBunny(movie.backdrop_path, movie.backdrop_storage_zone);
    }

    if (movie.trailer_path) {
      await deleteFromBunny(movie.trailer_path, movie.trailer_storage_zone);
    }

    await Movies.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Movie deleted successfully",
      data: movie,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
