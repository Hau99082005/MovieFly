const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

const compressVideo = async (inputPath, outputPath, options = {}) => {
  const {
    bitrate = "1000k",
    resolution = "1280x720",
    codec = "libx264",
    preset = "medium",
    audioBitrate = "128k",
  } = options;

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec(codec)
      .size(resolution)
      .videoBitrate(bitrate)
      .audioCodec("aac")
      .audioBitrate(audioBitrate)
      .outputOptions([
        "-preset", preset,
        "-movflags", "frag_keyframe+empty_moov",
        "-crf", "28",
      ])
      .on("end", () => {
        resolve(outputPath);
      })
      .on("error", (err) => {
        reject(err);
      })
      .save(outputPath);
  });
};

const getVideoInfo = (inputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
};

const calculateOptimalBitrate = (width, height, duration) => {
  const pixels = width * height;
  let bitrate;

  if (pixels <= 640 * 480) {
    bitrate = "800k";
  } else if (pixels <= 1280 * 720) {
    bitrate = "1500k";
  } else if (pixels <= 1920 * 1080) {
    bitrate = "3000k";
  } else {
    bitrate = "5000k";
  }

  if (duration > 3600) {
    bitrate = parseInt(bitrate) * 0.8 + "k";
  }

  return bitrate;
};

module.exports = {
  compressVideo,
  getVideoInfo,
  calculateOptimalBitrate,
};
