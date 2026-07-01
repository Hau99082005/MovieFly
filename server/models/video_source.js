const mongoose = require("mongoose");

const videoSourceShema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    episodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Episode",
      required: false,
    },
    quality: {
      type: Number,
      required: true,
    },
    format: {
      type: String,
      enum: [
        "mp4",
        "mkv",
        "avi",
        "mov",
        "flv",
        "wmv",
        "webm",
        "mpeg",
        "3gp",
        "vob",
        "ogv",
        "ts",
        "m4v",
      ],
      required: true,
      default: "mp4",
    },
    url: {
      type: String,
      required: true,
    },
    bunny_file_path: {
      type: String,
      required: false,
    },
    bunny_storage_zone: {
      type: String,
      required: false,
    },
    cdn_region: {
      type: String,
      required: true,
    },
    file_size_mb: {
      type: Number,
      required: true,
    },
    is_default: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

const VideoSource = mongoose.model("VideoSource", videoSourceShema);
module.exports = VideoSource;
