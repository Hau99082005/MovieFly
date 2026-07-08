const VideoSource = require("../models/video_source");
const {
  uploadLargeFileToCloudinary,
  deleteFromCloudinary,
} = require("../lib/cloudinaryService");
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
      return res
        .status(404)
        .json({ message: "Default video source not found" });
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
    const { movieId, episodeId, format, cdn_region, is_default } = req.body;

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

    const uploadResult = await uploadLargeFileToCloudinary(
      req.file.buffer,
      req.file.originalname,
      "videos",
      true,
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
      cloudinary_file_path: uploadResult.filePath,
      cloudinary_storage_zone: uploadResult.storageZone,
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

    const { format, cdn_region, is_default } = req.body;

    if (req.file) {
      if (videoSource.cloudinary_file_path) {
        await deleteFromCloudinary(
          videoSource.cloudinary_file_path,
          videoSource.cloudinary_storage_zone,
        );
      }

      const videoMetadata = await getVideoMetadata(req.file.buffer);

      const uploadResult = await uploadLargeFileToCloudinary(
        req.file.buffer,
        req.file.originalname,
        "videos",
        true,
      );

      if (!uploadResult.success) {
        return res
          .status(500)
          .json({ message: "Failed to upload video to CDN" });
      }

      videoSource.quality = videoMetadata.quality;
      videoSource.file_size_mb = videoMetadata.file_size_mb;
      videoSource.url = uploadResult.cdnUrl;
      videoSource.cloudinary_file_path = uploadResult.filePath;
      videoSource.cloudinary_storage_zone = uploadResult.storageZone;
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

    if (videoSource.cloudinary_file_path) {
      await deleteFromCloudinary(
        videoSource.cloudinary_file_path,
        videoSource.cloudinary_storage_zone,
      );
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
      if (source.cloudinary_file_path) {
        return deleteFromCloudinary(
          source.cloudinary_file_path,
          source.cloudinary_storage_zone,
        );
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
      if (source.cloudinary_file_path) {
        return deleteFromCloudinary(
          source.cloudinary_file_path,
          source.cloudinary_storage_zone,
        );
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

const fs = require("fs");
const path = require("path");
const uploadDir = path.join(__dirname, "../uploads/chunks");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadChunk = async (req, res) => {
  try {
    const { chunkIndex, totalChunks, uploadId, fileName } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Chunk file is required" });
    }

    const uploadFolder = path.join(uploadDir, uploadId);
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    const chunkPath = path.join(uploadFolder, `chunk-${chunkIndex}`);
    fs.writeFileSync(chunkPath, req.file.buffer);

    return res.status(200).json({
      message: "Chunk uploaded successfully",
      chunkIndex: parseInt(chunkIndex),
      totalChunks: parseInt(totalChunks),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const finalizeChunkUpload = async (req, res) => {
  let uploadFolder = null;
  let finalFilePath = null;

  try {
    const {
      uploadId,
      fileName,
      totalChunks,
      movieId,
      episodeId,
      quality,
      format,
      cdn_region,
      is_default,
    } = req.body;

    console.log("Finalize request:", { uploadId, fileName, totalChunks, movieId });

    uploadFolder = path.join(uploadDir, uploadId);
    finalFilePath = path.join(uploadDir, `final_${Date.now()}_${fileName}`);

    console.log("Upload folder:", uploadFolder);
    console.log("Final file path:", finalFilePath);

    if (!fs.existsSync(uploadFolder)) {
      return res.status(400).json({ 
        message: "Upload folder not found. Please re-upload chunks." 
      });
    }

    console.log("Creating write stream...");
    const writeStream = fs.createWriteStream(finalFilePath);

    for (let i = 0; i < parseInt(totalChunks); i++) {
      const chunkPath = path.join(uploadFolder, `chunk-${i}`);
      
      if (!fs.existsSync(chunkPath)) {
        console.error(`Chunk ${i} not found at:`, chunkPath);
        writeStream.end();
        if (fs.existsSync(finalFilePath)) fs.unlinkSync(finalFilePath);
        return res.status(400).json({ 
          message: `Chunk ${i} not found` 
        });
      }

      const chunkBuffer = fs.readFileSync(chunkPath);
      writeStream.write(chunkBuffer);
      console.log(`Chunk ${i} written, size: ${chunkBuffer.length} bytes`);
    }

    writeStream.end();

    await new Promise((resolve, reject) => {
      writeStream.on("finish", () => {
        console.log("Write stream finished");
        resolve();
      });
      writeStream.on("error", (err) => {
        console.error("Write stream error:", err);
        reject(err);
      });
    });

    const fileStats = fs.statSync(finalFilePath);
    console.log("Final file size:", fileStats.size, "bytes");

    console.log("Reading final file for metadata...");
    const fileBuffer = fs.readFileSync(finalFilePath);
    console.log("File buffer length:", fileBuffer.length);

    console.log("Getting video metadata...");
    const videoMetadata = await getVideoMetadata(fileBuffer);
    console.log("Video metadata:", videoMetadata);

    console.log("Uploading to Cloudinary CDN...");
    const uploadResult = await uploadLargeFileToCloudinary(
      fileBuffer,
      fileName,
      "videos",
    );
    console.log("Upload result:", uploadResult);

    console.log("Cleaning up local files...");
    if (fs.existsSync(uploadFolder)) {
      const remainingFiles = fs.readdirSync(uploadFolder);
      remainingFiles.forEach(file => {
        const filePath = path.join(uploadFolder, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      fs.rmdirSync(uploadFolder);
    }

    if (fs.existsSync(finalFilePath)) {
      fs.unlinkSync(finalFilePath);
    }

    if (!uploadResult.success) {
      return res.status(500).json({ message: "Failed to upload video to CDN" });
    }

    if (is_default) {
      const query = { movieId, is_default: true };
      if (episodeId) query.episodeId = episodeId;
      await VideoSource.updateMany(query, { is_default: false });
    }

    console.log("Creating video source in database...");
    const newVideoSource = new VideoSource({
      movieId,
      episodeId,
      quality: quality || videoMetadata.quality,
      format,
      url: uploadResult.cdnUrl,
      cdn_region,
      file_size_mb: videoMetadata.file_size_mb,
      is_default: is_default || false,
      cloudinary_file_path: uploadResult.filePath,
      cloudinary_storage_zone: uploadResult.storageZone,
    });

    await newVideoSource.save();

    const populatedVideoSource = await VideoSource.findById(newVideoSource._id)
      .populate("movieId")
      .populate("episodeId");

    console.log("Video source created successfully");

    return res.status(201).json({
      message: "Video source created successfully",
      data: populatedVideoSource,
    });
  } catch (error) {
    console.error("Finalize error:", error);
    console.error("Error stack:", error.stack);

    if (uploadFolder && fs.existsSync(uploadFolder)) {
      try {
        const remainingFiles = fs.readdirSync(uploadFolder);
        remainingFiles.forEach(file => {
          fs.unlinkSync(path.join(uploadFolder, file));
        });
        fs.rmdirSync(uploadFolder);
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }
    }

    if (finalFilePath && fs.existsSync(finalFilePath)) {
      try {
        fs.unlinkSync(finalFilePath);
      } catch (cleanupError) {
        console.error("Final file cleanup error:", cleanupError);
      }
    }

    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
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
  uploadChunk,
  finalizeChunkUpload,
};
