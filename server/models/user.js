const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      default: undefined,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email"],
    },
    password_hash: {
      type: String,
      required: false,
    },
    full_name: {
      type: String,
      required: true,
    },
    avatar_url: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    birth_day: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    email_verified_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

userSchema.index({ clerkId: 1 }, { unique: true, sparse: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
