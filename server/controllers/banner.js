const Banner = require("../models/Banner");
const { uploadToBunny, deleteFromBunny } = require("../lib/bunnyService");

const createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const { title, description, link, order } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const uploadResult = await uploadToBunny(
      req.file.buffer,
      req.file.originalname,
      "banners",
    );

    const newBanner = new Banner({
      title,
      description: description || "",
      image_url: uploadResult.cdnUrl,
      bunny_file_path: uploadResult.filePath,
      link: link || "",
      order: order || 0,
      is_active: true,
    });

    await newBanner.save();

    return res.status(201).json({
      message: "Banner created successfully",
      banner: newBanner,
    });
  } catch (error) {
    console.error("Create banner error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, link, order, is_active } = req.body;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    if (req.file) {
      await deleteFromBunny(banner.bunny_file_path);

      const uploadResult = await uploadToBunny(
        req.file.buffer,
        req.file.originalname,
        "banners",
      );

      banner.image_url = uploadResult.cdnUrl;
      banner.bunny_file_path = uploadResult.filePath;
    }

    if (title) banner.title = title;
    if (description !== undefined) banner.description = description;
    if (link !== undefined) banner.link = link;
    if (order !== undefined) banner.order = order;
    if (is_active !== undefined) banner.is_active = is_active;

    await banner.save();

    return res.status(200).json({
      message: "Banner updated successfully",
      banner,
    });
  } catch (error) {
    console.error("Update banner error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getBanners = async (req, res) => {
  try {
    const { is_active } = req.query;

    const filter = {};
    if (is_active !== undefined) {
      filter.is_active = is_active === "true";
    }

    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      banners,
      total: banners.length,
    });
  } catch (error) {
    console.error("Get banners error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getBannerById = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    return res.status(200).json({ banner });
  } catch (error) {
    console.error("Get banner error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    try {
      await deleteFromBunny(banner.bunny_file_path);
    } catch (bunnyError) {
      console.error("Failed to delete from Bunny:", bunnyError.message);
    }

    await Banner.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Delete banner error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createBanner,
  updateBanner,
  getBanners,
  getBannerById,
  deleteBanner,
};
