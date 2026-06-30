const mongoose = require("mongoose");

const MoviesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    original_title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: ["movie", "series"],
      required: true,
      default: "movie",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      required: true,
      default: "draft",
    },
    synopsis: {
      type: String,
      default: "",
    },
    tagline: {
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
    backdrop_url: {
      type: String,
      default: "",
    },
    backdrop_path: {
      type: String,
      default: "",
    },
    backdrop_storage_zone: {
      type: String,
      default: "",
    },
    trailer_url: {
      type: String,
      default: "",
    },
    trailer_path: {
      type: String,
      default: "",
    },
    trailer_storage_zone: {
      type: String,
      default: "",
    },
    release_date: {
      type: Date,
      default: null,
    },
    country_code: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "",
    },
    duration_min: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    imdb_id: {
      type: String,
      default: "",
    },
    imdb_score: {
      type: Number,
      default: 0,
    },
    view_count: {
      type: Number,
      default: 0,
    },
    like_count: {
      type: Number,
      default: 0,
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    is_free: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Movie = mongoose.model("Movie", MoviesSchema);
module.exports = Movie;
