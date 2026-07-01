const mongoose = require("mongoose");

const peopleSchema = new mongoose.Schema(
  {
    full_name: {
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
    birth_date: {
      type: Date,
      required: true,
    },
    country_code: {
      type: mongoose.Schema.Types.String,
      ref: "Countries",
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    avatar_url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const People = mongoose.model("People", peopleSchema);
module.exports = People;
