const UserProfile = require("../models/userProfile");

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId query parameter is required" });
    }

    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    return res.status(200).json({ profile });
  } catch (error) {
    return res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};

const createUserProfile = async (req, res) => {
  try {
    const { userId, bio, country_code, language, preferred_quality, subtitle_lang } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const existingProfile = await UserProfile.findOne({ userId });

    if (existingProfile) {
      return res.status(400).json({ message: "User profile already exists" });
    }

    const newProfile = new UserProfile({
      userId,
      bio: bio || "",
      country_code: country_code || "",
      language: language || "en",
      preferred_quality: preferred_quality || "1080p",
      subtitle_lang: subtitle_lang || "en",
    });

    await newProfile.save();

    return res.status(201).json({
      message: "User profile created successfully",
      profile: newProfile,
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { userId, bio, country_code, language, preferred_quality, subtitle_lang } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (country_code !== undefined) updateData.country_code = country_code;
    if (language !== undefined) updateData.language = language;
    if (preferred_quality !== undefined) updateData.preferred_quality = preferred_quality;
    if (subtitle_lang !== undefined) updateData.subtitle_lang = subtitle_lang;

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    return res.status(200).json({
      message: "User profile updated successfully",
      profile,
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const profile = await UserProfile.findOneAndDelete({ userId });

    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    return res.status(200).json({ 
      message: "User profile deleted successfully" 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};

module.exports = {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
