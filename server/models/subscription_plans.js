const mongoose = require("mongoose");

const SubscriptionPlanSchema = new mongoose.Schema(
  {
    name: {
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
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    duration_days: {
      type: Number,
      required: true,
    },
    max_screens: {
      type: Boolean,
      required: true,
      default: false,
    },
    max_downloads: {
      type: Number,
      required: true,
      default: 0,
    },
    video_quality: {
      type: String,
      enum: ["SD", "HD", "FHD", "4K"],
      default: "HD",
    },
    has_ads: {
      type: Boolean,
      required: true,
      default: false,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
    sort_order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  SubscriptionPlanSchema,
);

module.exports = SubscriptionPlan;
