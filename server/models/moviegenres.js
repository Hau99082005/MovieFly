const mongoose = require("mongoose");

const movieGenresSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    genreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
      required: true,
    },
  },
  { timestamps: true },
);

const MovieGenre = mongoose.model("MovieGenre", movieGenresSchema);
module.exports = MovieGenre;
