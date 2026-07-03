const Settings = require("../models/settings");

const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    return res.status(200).json({
      message: "Settings retrieved successfully",
      data: settings,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const {
      site_name,
      site_description,
      site_logo,
      site_favicon,
      primary_color,
      secondary_color,
      background_color,
      text_color,
      contact_email,
      contact_phone,
      social_facebook,
      social_twitter,
      social_youtube,
      social_instagram,
      enable_comments,
      enable_ratings,
      maintenance_mode,
    } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    if (site_name !== undefined) settings.site_name = site_name;
    if (site_description !== undefined) settings.site_description = site_description;
    if (site_logo !== undefined) settings.site_logo = site_logo;
    if (site_favicon !== undefined) settings.site_favicon = site_favicon;
    if (primary_color !== undefined) settings.primary_color = primary_color;
    if (secondary_color !== undefined) settings.secondary_color = secondary_color;
    if (background_color !== undefined) settings.background_color = background_color;
    if (text_color !== undefined) settings.text_color = text_color;
    if (contact_email !== undefined) settings.contact_email = contact_email;
    if (contact_phone !== undefined) settings.contact_phone = contact_phone;
    if (social_facebook !== undefined) settings.social_facebook = social_facebook;
    if (social_twitter !== undefined) settings.social_twitter = social_twitter;
    if (social_youtube !== undefined) settings.social_youtube = social_youtube;
    if (social_instagram !== undefined) settings.social_instagram = social_instagram;
    if (enable_comments !== undefined) settings.enable_comments = enable_comments;
    if (enable_ratings !== undefined) settings.enable_ratings = enable_ratings;
    if (maintenance_mode !== undefined) settings.maintenance_mode = maintenance_mode;

    await settings.save();

    return res.status(200).json({
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
