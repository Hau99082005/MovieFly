const Subtitle = require("../models/subtitles");
const { uploadToBunny, deleteFromBunny } = require("../lib/bunnyService");

const getAllSubtitles = async (req, res) => {
  try {
    const subtitles = await Subtitle.find({})
      .populate("movieId")
      .populate("episodeId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Subtitles retrieved successfully",
      data: subtitles,
      total: subtitles.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getSubtitleById = async (req, res) => {
  try {
    const { id } = req.params;

    const subtitle = await Subtitle.findById(id)
      .populate("movieId")
      .populate("episodeId");

    if (!subtitle) {
      return res.status(404).json({ message: "Subtitle not found" });
    }

    return res.status(200).json({
      message: "Subtitle retrieved successfully",
      data: subtitle,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getSubtitlesByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;

    const subtitles = await Subtitle.find({ movieId })
      .populate("episodeId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Subtitles retrieved successfully",
      data: subtitles,
      total: subtitles.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getSubtitlesByEpisodeId = async (req, res) => {
  try {
    const { episodeId } = req.params;

    const subtitles = await Subtitle.find({ episodeId })
      .populate("movieId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Subtitles retrieved successfully",
      data: subtitles,
      total: subtitles.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const createSubtitle = async (req, res) => {
  try {
    const { movieId, episodeId, language, label, format } = req.body;

    if (!episodeId || !language || !label) {
      return res.status(400).json({
        message: "episodeId, language and label are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Subtitle file is required" });
    }

    const fileFormat = format || "srt";

    if (!["srt", "vtt"].includes(fileFormat)) {
      return res.status(400).json({
        message: "Invalid format. Must be: srt or vtt",
      });
    }

    let finalMovieId = movieId;

    if (!finalMovieId) {
      const Episode = require("../models/episodes");
      const episode = await Episode.findById(episodeId);
      if (!episode) {
        return res.status(404).json({ message: "Episode not found" });
      }
      finalMovieId = episode.movieId;
    }

    if (!finalMovieId) {
      return res.status(400).json({
        message: "movieId is required or episodeId must have a valid movieId",
      });
    }

    const subtitleUpload = await uploadToBunny(
      req.file.buffer,
      req.file.originalname,
      "subtitles",
    );

    if (!subtitleUpload.success) {
      return res.status(500).json({ message: "Failed to upload subtitle" });
    }

    const newSubtitle = new Subtitle({
      movieId: finalMovieId,
      episodeId,
      language,
      label,
      url: subtitleUpload.cdnUrl,
      format: fileFormat,
    });

    await newSubtitle.save();

    const populatedSubtitle = await Subtitle.findById(newSubtitle._id)
      .populate("movieId")
      .populate("episodeId");

    return res.status(201).json({
      message: "Subtitle created successfully",
      data: populatedSubtitle,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updateSubtitle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Subtitle ID is required" });
    }

    const subtitle = await Subtitle.findById(id);

    if (!subtitle) {
      return res.status(404).json({ message: "Subtitle not found" });
    }

    const { language, label, format } = req.body;

    if (language) subtitle.language = language;
    if (label) subtitle.label = label;

    if (format) {
      if (!["srt", "vtt"].includes(format)) {
        return res.status(400).json({
          message: "Invalid format. Must be: srt or vtt",
        });
      }
      subtitle.format = format;
    }

    if (req.file) {
      if (subtitle.url) {
        const oldFilePath = subtitle.url.split(".b-cdn.net/")[1];
        if (oldFilePath) {
          await deleteFromBunny(oldFilePath).catch((err) =>
            console.log("Delete old subtitle error:", err.message),
          );
        }
      }

      const subtitleUpload = await uploadToBunny(
        req.file.buffer,
        req.file.originalname,
        "subtitles",
      );

      if (!subtitleUpload.success) {
        return res.status(500).json({ message: "Failed to upload subtitle" });
      }

      subtitle.url = subtitleUpload.cdnUrl;
    }

    await subtitle.save();

    const populatedSubtitle = await Subtitle.findById(id)
      .populate("movieId")
      .populate("episodeId");

    return res.status(200).json({
      message: "Subtitle updated successfully",
      data: populatedSubtitle,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteSubtitle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Subtitle ID is required" });
    }

    const subtitle = await Subtitle.findById(id);

    if (!subtitle) {
      return res.status(404).json({ message: "Subtitle not found" });
    }

    if (subtitle.url) {
      const filePath = subtitle.url.split(".b-cdn.net/")[1];
      if (filePath) {
        await deleteFromBunny(filePath).catch((err) =>
          console.log("Delete subtitle error:", err.message),
        );
      }
    }

    const deletedSubtitle = await Subtitle.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Subtitle deleted successfully",
      data: deletedSubtitle,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteSubtitlesByEpisodeId = async (req, res) => {
  try {
    const { episodeId } = req.params;

    const subtitles = await Subtitle.find({ episodeId });

    for (const subtitle of subtitles) {
      if (subtitle.url) {
        const filePath = subtitle.url.split(".b-cdn.net/")[1];
        if (filePath) {
          await deleteFromBunny(filePath).catch((err) =>
            console.log("Delete subtitle error:", err.message),
          );
        }
      }
    }

    const result = await Subtitle.deleteMany({ episodeId });

    return res.status(200).json({
      message: "Subtitles deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getAllSubtitles,
  getSubtitleById,
  getSubtitlesByMovieId,
  getSubtitlesByEpisodeId,
  createSubtitle,
  updateSubtitle,
  deleteSubtitle,
  deleteSubtitlesByEpisodeId,
};
