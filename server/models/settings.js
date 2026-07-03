const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    site_name: {
      type: String,
      default: "MovieFly",
    },
    site_description: {
      type: String,
      default: "",
    },
    site_logo: {
      type: String,
      default: "",
    },
    site_favicon: {
      type: String,
      default: "",
    },
    primary_color: {
      type: String,
      default: "#3b82f6",
    },
    secondary_color: {
      type: String,
      default: "#8b5cf6",
    },
    background_color: {
      type: String,
      default: "#18181b",
    },
    text_color: {
      type: String,
      default: "#ffffff",
    },
    contact_email: {
      type: String,
      default: "",
    },
    contact_phone: {
      type: String,
      default: "",
    },
    social_facebook: {
      type: String,
      default: "",
    },
    social_twitter: {
      type: String,
      default: "",
    },
    social_youtube: {
      type: String,
      default: "",
    },
    social_instagram: {
      type: String,
      default: "",
    },
    enable_comments: {
      type: Boolean,
      default: true,
    },
    enable_ratings: {
      type: Boolean,
      default: true,
    },
    maintenance_mode: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
