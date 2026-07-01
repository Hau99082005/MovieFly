const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    seasonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: true,
    },
    episodeNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    synopsis: {
      type: String,
      default: "",
    },
    thumbnailUrl: {
      type: String,
      default: "",
    },
    thumbnail_path: {
      type: String,
      default: "",
    },
    thumbnail_storage_zone: {
      type: String,
      default: "",
    },
    video_url: {
      type: String,
      default: "",
    },
    video_path: {
      type: String,
      default: "",
    },
    video_storage_zone: {
      type: String,
      default: "",
    },
    durationSeconds: {
      type: Number,
      default: 0,
    },
    releaseDate: {
      type: Date,
      default: null,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Episode = mongoose.model("Episode", episodeSchema);
module.exports = Episode;
