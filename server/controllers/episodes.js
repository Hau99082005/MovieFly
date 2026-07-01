const Episode = require("../models/episodes");
const { uploadToBunny, uploadLargeFileToBunny, deleteFromBunny } = require("../lib/bunnyService");
const { getVideoDuration } = require("../lib/videoUtils");

const getAllEpisodes = async (req, res) => {
  try {
    const { movieId, seasonId } = req.query;

    const filter = {};
    if (movieId) filter.movieId = movieId;
    if (seasonId) filter.seasonId = seasonId;

    const episodes = await Episode.find(filter)
      .populate("movieId")
      .populate("seasonId")
      .sort({ seasonId: 1, episodeNumber: 1 });

    return res.status(200).json({
      message: "Episodes retrieved successfully",
      data: episodes,
      total: episodes.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getEpisodesBySeasonId = async (req, res) => {
  try {
    const { seasonId } = req.params;

    if (!seasonId) {
      return res.status(400).json({ message: "Season ID is required" });
    }

    const episodes = await Episode.find({ seasonId })
      .populate("movieId")
      .populate("seasonId")
      .sort({ episodeNumber: 1 });

    return res.status(200).json({
      message: "Episodes retrieved successfully",
      data: episodes,
      total: episodes.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getEpisodeById = async (req, res) => {
  try {
    const { id } = req.params;

    const episode = await Episode.findById(id)
      .populate("movieId")
      .populate("seasonId");

    if (!episode) {
      return res.status(404).json({ message: "Episode not found" });
    }

    return res.status(200).json({
      message: "Episode retrieved successfully",
      data: episode,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const createEpisode = async (req, res) => {
  try {
    const {
      movieId,
      seasonId,
      episodeNumber,
      title,
      synopsis,
      releaseDate,
      viewCount,
      isFree,
    } = req.body;

    if (!movieId || !seasonId || !episodeNumber || !title) {
      return res.status(400).json({
        message: "movieId, seasonId, episodeNumber and title are required",
      });
    }

    const existingEpisode = await Episode.findOne({
      seasonId,
      episodeNumber,
    });

    if (existingEpisode) {
      return res.status(409).json({
        message: "Episode number already exists for this season",
      });
    }

    const episodeData = {
      movieId,
      seasonId,
      episodeNumber,
      title,
      synopsis: synopsis || "",
      releaseDate: releaseDate || null,
      viewCount: viewCount || 0,
      isFree: isFree || false,
      durationSeconds: 0,
    };

    const uploadPromises = [];

    if (req.files) {
      if (req.files.thumbnail) {
        uploadPromises.push(
          uploadToBunny(
            req.files.thumbnail[0].buffer,
            req.files.thumbnail[0].originalname,
            "episodes/thumbnails"
          ).then(result => ({
            field: "thumbnail",
            url: result.cdnUrl,
            path: result.filePath,
            zone: result.storageZone,
          }))
        );
      }

      if (req.files.video) {
        const videoBuffer = req.files.video[0].buffer;

        uploadPromises.push(
          Promise.all([
            uploadLargeFileToBunny(
              videoBuffer,
              req.files.video[0].originalname,
              "episodes/videos"
            ),
            getVideoDuration(videoBuffer).catch(() => 0)
          ]).then(([uploadResult, durationMinutes]) => ({
            field: "video",
            url: uploadResult.cdnUrl,
            path: uploadResult.filePath,
            zone: uploadResult.storageZone,
            duration: durationMinutes * 60,
          }))
        );
      }
    }

    const uploadResults = await Promise.all(uploadPromises);

    uploadResults.forEach(result => {
      if (result.field === "thumbnail") {
        episodeData.thumbnailUrl = result.url;
        episodeData.thumbnail_path = result.path;
        episodeData.thumbnail_storage_zone = result.zone;
      } else if (result.field === "video") {
        episodeData.video_url = result.url;
        episodeData.video_path = result.path;
        episodeData.video_storage_zone = result.zone;
        if (result.duration && result.duration > 0) {
          episodeData.durationSeconds = result.duration;
        }
      }
    });

    const newEpisode = new Episode(episodeData);
    const savedEpisode = await newEpisode.save();

    const populatedEpisode = await Episode.findById(savedEpisode._id)
      .populate("movieId")
      .populate("seasonId");

    return res.status(201).json({
      message: "Episode created successfully",
      data: populatedEpisode,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updateEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      movieId,
      seasonId,
      episodeNumber,
      title,
      synopsis,
      releaseDate,
      viewCount,
      isFree,
    } = req.body;

    const episode = await Episode.findById(id);

    if (!episode) {
      return res.status(404).json({ message: "Episode not found" });
    }

    if (seasonId && episodeNumber) {
      const existingEpisode = await Episode.findOne({
        seasonId: seasonId || episode.seasonId,
        episodeNumber: episodeNumber || episode.episodeNumber,
        _id: { $ne: id },
      });

      if (existingEpisode) {
        return res.status(409).json({
          message: "Episode number already exists for this season",
        });
      }
    }

    const updateData = {};
    if (movieId !== undefined) updateData.movieId = movieId;
    if (seasonId !== undefined) updateData.seasonId = seasonId;
    if (episodeNumber !== undefined) updateData.episodeNumber = episodeNumber;
    if (title !== undefined) updateData.title = title;
    if (synopsis !== undefined) updateData.synopsis = synopsis;
    if (releaseDate !== undefined) updateData.releaseDate = releaseDate;
    if (viewCount !== undefined) updateData.viewCount = viewCount;
    if (isFree !== undefined) updateData.isFree = isFree;

    const uploadPromises = [];
    const deletePromises = [];

    if (req.files) {
      if (req.files.thumbnail) {
        if (episode.thumbnail_path) {
          deletePromises.push(
            deleteFromBunny(episode.thumbnail_path, episode.thumbnail_storage_zone)
          );
        }
        uploadPromises.push(
          uploadToBunny(
            req.files.thumbnail[0].buffer,
            req.files.thumbnail[0].originalname,
            "episodes/thumbnails"
          ).then(result => ({
            field: "thumbnail",
            url: result.cdnUrl,
            path: result.filePath,
            zone: result.storageZone,
          }))
        );
      }

      if (req.files.video) {
        if (episode.video_path) {
          deletePromises.push(
            deleteFromBunny(episode.video_path, episode.video_storage_zone)
          );
        }

        const videoBuffer = req.files.video[0].buffer;

        uploadPromises.push(
          Promise.all([
            uploadLargeFileToBunny(
              videoBuffer,
              req.files.video[0].originalname,
              "episodes/videos"
            ),
            getVideoDuration(videoBuffer).catch(() => 0)
          ]).then(([uploadResult, durationMinutes]) => ({
            field: "video",
            url: uploadResult.cdnUrl,
            path: uploadResult.filePath,
            zone: uploadResult.storageZone,
            duration: durationMinutes * 60,
          }))
        );
      }
    }

    await Promise.all(deletePromises);

    const uploadResults = await Promise.all(uploadPromises);

    uploadResults.forEach(result => {
      if (result.field === "thumbnail") {
        updateData.thumbnailUrl = result.url;
        updateData.thumbnail_path = result.path;
        updateData.thumbnail_storage_zone = result.zone;
      } else if (result.field === "video") {
        updateData.video_url = result.url;
        updateData.video_path = result.path;
        updateData.video_storage_zone = result.zone;
        if (result.duration && result.duration > 0) {
          updateData.durationSeconds = result.duration;
        }
      }
    });

    const updatedEpisode = await Episode.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("movieId")
      .populate("seasonId");

    return res.status(200).json({
      message: "Episode updated successfully",
      data: updatedEpisode,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteEpisode = async (req, res) => {
  try {
    const { id } = req.params;

    const episode = await Episode.findById(id);

    if (!episode) {
      return res.status(404).json({ message: "Episode not found" });
    }

    const deletePromises = [];

    if (episode.thumbnail_path) {
      deletePromises.push(
        deleteFromBunny(episode.thumbnail_path, episode.thumbnail_storage_zone)
      );
    }

    if (episode.video_path) {
      deletePromises.push(
        deleteFromBunny(episode.video_path, episode.video_storage_zone)
      );
    }

    await Promise.all(deletePromises);

    await Episode.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Episode deleted successfully",
      data: episode,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteEpisodesBySeasonId = async (req, res) => {
  try {
    const { seasonId } = req.params;

    if (!seasonId) {
      return res.status(400).json({ message: "Season ID is required" });
    }

    const episodes = await Episode.find({ seasonId });

    if (episodes.length === 0) {
      return res.status(404).json({
        message: "No episodes found for this season",
      });
    }

    const deletePromises = [];

    episodes.forEach(episode => {
      if (episode.thumbnail_path) {
        deletePromises.push(
          deleteFromBunny(episode.thumbnail_path, episode.thumbnail_storage_zone)
        );
      }
      if (episode.video_path) {
        deletePromises.push(
          deleteFromBunny(episode.video_path, episode.video_storage_zone)
        );
      }
    });

    await Promise.all(deletePromises);

    const result = await Episode.deleteMany({ seasonId });

    return res.status(200).json({
      message: "All episodes deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const incrementViewCount = async (req, res) => {
  try {
    const { id } = req.params;

    const episode = await Episode.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .populate("movieId")
      .populate("seasonId");

    if (!episode) {
      return res.status(404).json({ message: "Episode not found" });
    }

    return res.status(200).json({
      message: "View count incremented",
      data: episode,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getAllEpisodes,
  getEpisodesBySeasonId,
  getEpisodeById,
  createEpisode,
  updateEpisode,
  deleteEpisode,
  deleteEpisodesBySeasonId,
  incrementViewCount,
};
