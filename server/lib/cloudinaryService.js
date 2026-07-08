const axios = require("axios");
const { compressVideo, getVideoInfo, calculateOptimalBitrate } = require("./videoCompression");
const fs = require("fs");
const path = require("path");

const CHUNK_SIZE = 5 * 1024 * 1024;
const MAX_RETRIES = 3;
const STORAGE_ZONES = process.env.CLOUDINARY_STORAGE_ZONE
  ? process.env.CLOUDINARY_STORAGE_ZONE.split(",")
  : ["study-storage-2026"];

const getStorageZone = (index = 0) => {
  return STORAGE_ZONES[index % STORAGE_ZONES.length].trim();
};

const uploadToCloudinary = async (fileBuffer, fileName, folder = "banners") => {
  try {
    const filePath = `${folder}/${Date.now()}-${fileName}`;
    const storageZone = getStorageZone(0);
    const uploadUrl = `${process.env.CLOUDINARY_STORAGE_HOST}/${storageZone}/${filePath}`;

    await axios.put(uploadUrl, fileBuffer, {
      headers: {
        AccessKey: process.env.CLOUDINARY_STORAGE_API_KEY,
        "Content-Type": "application/octet-stream",
      },
    });

    const cdnUrl = `https://${process.env.CLOUDINARY_PULL_ZONE}.b-cdn.net/${filePath}`;

    return {
      success: true,
      filePath,
      cdnUrl,
      storageZone,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error.response?.data || error.message);
    throw new Error("Failed to upload to Cloudinary CDN");
  }
};

const uploadChunkToCloudinary = async (
  chunk,
  fileName,
  folder,
  chunkIndex,
  totalChunks,
  retryCount = 0,
) => {
  try {
    const storageZone = getStorageZone(chunkIndex);
    const tempFilePath = `${folder}/temp/${Date.now()}-${fileName}.part${chunkIndex}`;
    const uploadUrl = `${process.env.CLOUDINARY_STORAGE_HOST}/${storageZone}/${tempFilePath}`;

    await axios.put(uploadUrl, chunk, {
      headers: {
        AccessKey: process.env.CLOUDINARY_STORAGE_API_KEY,
        "Content-Type": "application/octet-stream",
      },
      timeout: 60000,
    });

    return {
      success: true,
      chunkIndex,
      tempFilePath,
      storageZone,
    };
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying chunk ${chunkIndex}, attempt ${retryCount + 1}`);
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * (retryCount + 1)),
      );
      return uploadChunkToCloudinary(
        chunk,
        fileName,
        folder,
        chunkIndex,
        totalChunks,
        retryCount + 1,
      );
    }
    throw new Error(`Failed to upload chunk ${chunkIndex}: ${error.message}`);
  }
};

const mergeChunksOnCloudinary = async (chunkPaths, finalFileName, folder) => {
  try {
    const storageZone = getStorageZone(0);
    const finalPath = `${folder}/${Date.now()}-${finalFileName}`;
    const mergeUrl = `${process.env.CLOUDINARY_STORAGE_HOST}/${storageZone}/${finalPath}`;

    const chunks = await Promise.all(
      chunkPaths.map(async (chunkPath) => {
        const chunkUrl = `${process.env.CLOUDINARY_STORAGE_HOST}/${chunkPath.storageZone}/${chunkPath.tempFilePath}`;
        const response = await axios.get(chunkUrl, {
          headers: {
            AccessKey: process.env.CLOUDINARY_STORAGE_API_KEY,
          },
          responseType: "arraybuffer",
        });
        return Buffer.from(response.data);
      }),
    );

    const mergedBuffer = Buffer.concat(chunks);

    await axios.put(mergeUrl, mergedBuffer, {
      headers: {
        AccessKey: process.env.CLOUDINARY_STORAGE_API_KEY,
        "Content-Type": "application/octet-stream",
      },
    });

    await Promise.all(
      chunkPaths.map(async (chunkPath) => {
        const deleteUrl = `${process.env.CLOUDINARY_STORAGE_HOST}/${chunkPath.storageZone}/${chunkPath.tempFilePath}`;
        await axios
          .delete(deleteUrl, {
            headers: {
              AccessKey: process.env.CLOUDINARY_STORAGE_API_KEY,
            },
          })
          .catch((err) => console.log("Cleanup error:", err.message));
      }),
    );

    const cdnUrl = `https://${process.env.CLOUDINARY_PULL_ZONE}.b-cdn.net/${finalPath}`;

    return {
      success: true,
      filePath: finalPath,
      cdnUrl,
      storageZone,
    };
  } catch (error) {
    throw new Error(`Failed to merge chunks: ${error.message}`);
  }
};

const uploadLargeFileToCloudinary = async (
  fileBuffer,
  fileName,
  folder = "videos",
  compress = true,
) => {
  try {
    let processedBuffer = fileBuffer;

    if (compress) {
      const tempDir = path.join(__dirname, "..", "temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const inputPath = path.join(tempDir, `input-${Date.now()}-${fileName}`);
      const outputPath = path.join(tempDir, `output-${Date.now()}-${fileName}`);

      fs.writeFileSync(inputPath, fileBuffer);

      try {
        const metadata = await getVideoInfo(inputPath);
        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        const audioStream = metadata.streams.find(s => s.codec_type === 'audio');

        const width = videoStream?.width || 1280;
        const height = videoStream?.height || 720;
        const duration = metadata.format?.duration || 0;

        const bitrate = calculateOptimalBitrate(width, height, duration);
        const resolution = width > 1920 ? "1920x1080" : width > 1280 ? "1280x720" : "854x480";

        await compressVideo(inputPath, outputPath, {
          bitrate,
          resolution,
          preset: "slow",
          audioBitrate: "128k",
        });

        processedBuffer = fs.readFileSync(outputPath);

        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      } catch (compressError) {
        console.error("Compression error, using original:", compressError.message);
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        processedBuffer = fileBuffer;
      }
    }

    if (processedBuffer.length <= CHUNK_SIZE) {
      return uploadToCloudinary(processedBuffer, fileName, folder);
    }

    const totalChunks = Math.ceil(processedBuffer.length / CHUNK_SIZE);
    const chunkPromises = [];

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, processedBuffer.length);
      const chunk = processedBuffer.slice(start, end);
      chunkPromises.push(
        uploadChunkToCloudinary(chunk, fileName, folder, i, totalChunks),
      );
    }

    const uploadedChunks = await Promise.all(chunkPromises);

    const result = await mergeChunksOnCloudinary(uploadedChunks, fileName, folder);

    return result;
  } catch (error) {
    console.error("Large file upload error:", error.message);
    throw new Error("Failed to upload large file to Cloudinary CDN");
  }
};

const deleteFromCloudinary = async (filePath, storageZone = null) => {
  try {
    const zone = storageZone || getStorageZone(0);
    const deleteUrl = `${process.env.CLOUDINARY_STORAGE_HOST}/${zone}/${filePath}`;

    await axios.delete(deleteUrl, {
      headers: {
        AccessKey: process.env.CLOUDINARY_STORAGE_API_KEY,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Cloudinary delete error:", error.response?.data || error.message);
    throw new Error("Failed to delete from Cloudinary CDN");
  }
};

module.exports = {
  uploadToCloudinary,
  uploadLargeFileToCloudinary,
  deleteFromCloudinary,
  CHUNK_SIZE,
};
