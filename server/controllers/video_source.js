const VideoSource = require("../models/video_source");
const { uploadLargeFileToBunny, deleteFromBunny } = require("../lib/bunnyService");
const { getVideoMetadata } = require("../lib/videoUtils");

const getAllVideoSources = async (req, res) => {
  try {
    const videoSources = await VideoSource.find({})
      .populate("movieId")
      .populate("episodeId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Video sources retrieved successfully",
      data: videoSources,
      total: videoSources.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getVideoSourceById = async (req, res) => {
  try {
    const { id } = req.params;

    const videoSource = await VideoSource.findById(id)
      .populate("movieId")
      .populate("episodeId");

    if (!videoSource) {
      return res.status(404).json({ message: "Video source not found" });
    }

    return res.status(200).json({
      message: "Video source retrieved successfully",
      data: videoSource,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getVideoSourcesByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;

    const videoSources = await VideoSource.find({ movieId })
      .populate("episodeId")
      .sort({ quality: -1, is_default: -1 });

    return res.status(200).json({
      message: "Video sources retrieved successfully",
      data: videoSources,
      total: videoSources.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getVideoSourcesByEpisodeId = async (req, res) => {
  try {
    const { episodeId } = req.params;

    const videoSources = await VideoSource.find({ episodeId })
      .populate("movieId")
      .sort({ quality: -1, is_default: -1 });

    return res.status(200).json({
      message: "Video sources retrieved successfully",
      data: videoSources,
      total: videoSources.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getDefaultVideoSource = async (req, res) => {
  try {
    const { movieId, episodeId } = req.query;

    if (!movieId && !episodeId) {
      return res.status(400).json({
        message: "movieId or episodeId is required",
      });
    }

    const query = { is_default: true };
    if (movieId) query.movieId = movieId;
    if (episodeId) query.episodeId = episodeId;

    const videoSource = await VideoSource.findOne(query)
      .populate("movieId")
      .populate("episodeId");

    if (!videoSource) {
      return res.status(404).json({ message: "Default video source not found" });
    }

    return res.status(200).json({
      message: "Default video source retrieved successfully",
      data: videoSource,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getVideoSourcesByQuality = async (req, res) => {
  try {
    const { quality } = req.params;

    const videoSources = await VideoSource.find({ quality: parseInt(quality) })
      .populate("movieId")
      .populate("episodeId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Video sources retrieved successfully",
      data: videoSources,
      total: videoSources.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const createVideoSource = async (req, res) => {
  try {
    const {
      movieId,
      episodeId,
      format,
      cdn_region,
      is_default,
    } = req.body;

    if (!movieId || !format || !cdn_region) {
      return res.status(400).json({
        message: "movieId, format, and cdn_region are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Video file is required",
      });
    }

    const videoMetadata = await getVideoMetadata(req.file.buffer);

    const uploadResult = await uploadLargeFileToBunny(
      req.file.buffer,
      req.file.originalname,
      "videos"
    );

    if (!uploadResult.success) {
      return res.status(500).json({ message: "Failed to upload video to CDN" });
    }

    if (is_default) {
      const query = { movieId, is_default: true };
      if (episodeId) query.episodeId = episodeId;
      
      await VideoSource.updateMany(query, { is_default: false });
    }

    const newVideoSource = new VideoSource({
      movieId,
      episodeId,
      quality: videoMetadata.quality,
      format,
      url: uploadResult.cdnUrl,
      cdn_region,
      file_size_mb: videoMetadata.file_size_mb,
      is_default: is_default || false,
      bunny_file_path: uploadResult.filePath,
      bunny_storage_zone: uploadResult.storageZone,
    });

    await newVideoSource.save();

    const populatedVideoSource = await VideoSource.findById(newVideoSource._id)
      .populate("movieId")
      .populate("episodeId");

    return res.status(201).json({
      message: "Video source created successfully",
      data: populatedVideoSource,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updateVideoSource = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Video source ID is required" });
    }

    const videoSource = await VideoSource.findById(id);

    if (!videoSource) {
      return res.status(404).json({ message: "Video source not found" });
    }

    const {
      format,
      cdn_region,
      is_default,
    } = req.body;

    if (req.file) {
      if (videoSource.bunny_file_path) {
        await deleteFromBunny(videoSource.bunny_file_path, videoSource.bunny_storage_zone);
      }

      const videoMetadata = await getVideoMetadata(req.file.buffer);

      const uploadResult = await uploadLargeFileToBunny(
        req.file.buffer,
        req.file.originalname,
        "videos"
      );

      if (!uploadResult.success) {
        return res.status(500).json({ message: "Failed to upload video to CDN" });
      }

      videoSource.quality = videoMetadata.quality;
      videoSource.file_size_mb = videoMetadata.file_size_mb;
      videoSource.url = uploadResult.cdnUrl;
      videoSource.bunny_file_path = uploadResult.filePath;
      videoSource.bunny_storage_zone = uploadResult.storageZone;
    }

    if (format) videoSource.format = format;
    if (cdn_region) videoSource.cdn_region = cdn_region;

    if (is_default !== undefined) {
      if (is_default) {
        const query = { movieId: videoSource.movieId, is_default: true };
        if (videoSource.episodeId) query.episodeId = videoSource.episodeId;
        
        await VideoSource.updateMany(query, { is_default: false });
      }
      videoSource.is_default = is_default;
    }

    await videoSource.save();

    const populatedVideoSource = await VideoSource.findById(id)
      .populate("movieId")
      .populate("episodeId");

    return res.status(200).json({
      message: "Video source updated successfully",
      data: populatedVideoSource,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteVideoSource = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Video source ID is required" });
    }

    const videoSource = await VideoSource.findById(id);

    if (!videoSource) {
      return res.status(404).json({ message: "Video source not found" });
    }

    if (videoSource.bunny_file_path) {
      await deleteFromBunny(videoSource.bunny_file_path, videoSource.bunny_storage_zone);
    }

    await VideoSource.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Video source deleted successfully",
      data: videoSource,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteVideoSourcesByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    const videoSources = await VideoSource.find({ movieId });

    const deletePromises = videoSources.map((source) => {
      if (source.bunny_file_path) {
        return deleteFromBunny(source.bunny_file_path, source.bunny_storage_zone);
      }
      return Promise.resolve();
    });

    await Promise.all(deletePromises);

    const result = await VideoSource.deleteMany({ movieId });

    return res.status(200).json({
      message: "Video sources deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteVideoSourcesByEpisodeId = async (req, res) => {
  try {
    const { episodeId } = req.params;

    if (!episodeId) {
      return res.status(400).json({ message: "Episode ID is required" });
    }

    const videoSources = await VideoSource.find({ episodeId });

    const deletePromises = videoSources.map((source) => {
      if (source.bunny_file_path) {
        return deleteFromBunny(source.bunny_file_path, source.bunny_storage_zone);
      }
      return Promise.resolve();
    });

    await Promise.all(deletePromises);

    const result = await VideoSource.deleteMany({ episodeId });

    return res.status(200).json({
      message: "Video sources deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getAllVideoSources,
  getVideoSourceById,
  getVideoSourcesByMovieId,
  getVideoSourcesByEpisodeId,
  getDefaultVideoSource,
  getVideoSourcesByQuality,
  createVideoSource,
  updateVideoSource,
  deleteVideoSource,
  deleteVideoSourcesByMovieId,
  deleteVideoSourcesByEpisodeId,
};
