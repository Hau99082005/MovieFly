const mongoose = require("mongoose");

const Seasons = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    seasonNumber: {
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
    poster_url: {
      type: String,
      default: "",
    },
    poster_path: {
      type: String,
      default: "",
    },
    poster_storage_zone: {
      type: String,
      default: "",
    },
    releaseDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const Season = mongoose.model("Season", Seasons);
module.exports = Season;
