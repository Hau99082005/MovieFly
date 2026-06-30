const Genre = require("../models/genres");

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Genres retrieved successfully",
      data: genres,
      total: genres.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getGenreById = async (req, res) => {
  try {
    const { id } = req.params;

    const genre = await Genre.findById(id);

    if (!genre) {
      return res.status(404).json({ message: "Genre not found" });
    }

    return res.status(200).json({
      message: "Genre retrieved successfully",
      data: genre,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const createGenre = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const generatedSlug = slug || generateSlug(name);

    const existingGenre = await Genre.findOne({
      $or: [{ name }, { slug: generatedSlug }],
    });

    if (existingGenre) {
      return res.status(409).json({
        message: "Genre with the same name or slug already exists",
      });
    }

    const newGenre = new Genre({
      name,
      slug: generatedSlug,
      description: description || "",
    });

    await newGenre.save();

    return res.status(201).json({
      message: "Genre created successfully",
      data: newGenre,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    const genre = await Genre.findById(id);

    if (!genre) {
      return res.status(404).json({ message: "Genre not found" });
    }

    const updateData = {};

    if (name) {
      updateData.name = name;
      updateData.slug = slug || generateSlug(name);
    } else if (slug) {
      updateData.slug = slug;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (updateData.slug && updateData.slug !== genre.slug) {
      const existingSlug = await Genre.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      });
      if (existingSlug) {
        return res.status(409).json({ message: "Slug already exists" });
      }
    }

    const updatedGenre = await Genre.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "Genre updated successfully",
      data: updatedGenre,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGenre = await Genre.findByIdAndDelete(id);

    if (!deletedGenre) {
      return res.status(404).json({ message: "Genre not found" });
    }

    return res.status(200).json({
      message: "Genre deleted successfully",
      data: deletedGenre,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
};
