const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    country_code: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "en",
    },
    preferred_quality: {
      type: String,
      enum: ["480p", "720p", "1080p", "4K", "auto"],
      default: "1080p",
    },
    subtitle_lang: {
      type: String,
      default: "en",
    },
  },
  { timestamps: true }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;
