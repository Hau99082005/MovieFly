const mongoose = require("mongoose");

const SubtitleSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: false,
    },
    episodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Episode",
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      enum: ["srt", "vtt"],
      required: true,
      default: "srt",
    },
  },
  { timestamps: true },
);

const Subtitle = mongoose.model("Subtitle", SubtitleSchema);
module.exports = Subtitle;
