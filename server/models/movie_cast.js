const mongoose = require("mongoose");

const movieCastSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    personId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "People",
      required: true,
    },
    role: {
      type: String,
      enum: ["actor", "director", "producer", "writer"],
      required: true,
    },
    characterName: {
      type: String,
      required: function () {
        return this.role === "actor";
      },
    },
    sortOrder: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const MovieCast = mongoose.model("MovieCast", movieCastSchema);
module.exports = MovieCast;
