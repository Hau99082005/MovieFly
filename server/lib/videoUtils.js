const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffprobeInstaller = require("@ffprobe-installer/ffprobe");
const fs = require("fs");
const path = require("path");
const os = require("os");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const getVideoDuration = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `temp_video_${Date.now()}.mp4`);

    fs.writeFile(tempFilePath, fileBuffer, (writeErr) => {
      if (writeErr) {
        return reject(new Error("Failed to write temp file"));
      }

      ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
        fs.unlink(tempFilePath, () => {});

        if (err) {
          return reject(new Error("Failed to read video metadata"));
        }

        if (metadata && metadata.format && metadata.format.duration) {
          const durationInMinutes = Math.ceil(metadata.format.duration / 60);
          resolve(durationInMinutes);
        } else {
          resolve(0);
        }
      });
    });
  });
};

const getVideoMetadata = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `temp_video_${Date.now()}.mp4`);

    fs.writeFile(tempFilePath, fileBuffer, (writeErr) => {
      if (writeErr) {
        return reject(new Error("Failed to write temp file"));
      }

      ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
        fs.unlink(tempFilePath, () => {});

        if (err) {
          return reject(new Error("Failed to read video metadata"));
        }

        const videoStream = metadata.streams.find(
          (s) => s.codec_type === "video",
        );

        if (!videoStream) {
          return reject(new Error("No video stream found"));
        }

        const height = videoStream.height || 0;
        const fileSizeMB = Math.ceil(fileBuffer.length / (1024 * 1024));

        let quality = 480;
        if (height >= 2160) quality = 2160;
        else if (height >= 1080) quality = 1080;
        else if (height >= 720) quality = 720;
        else if (height >= 480) quality = 480;
        else quality = 360;

        resolve({
          quality,
          file_size_mb: fileSizeMB,
          width: videoStream.width,
          height: videoStream.height,
          duration: metadata.format.duration,
          bitrate: metadata.format.bit_rate,
        });
      });
    });
  });
};

module.exports = {
  getVideoDuration,
  getVideoMetadata,
};
