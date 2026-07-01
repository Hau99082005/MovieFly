const SubscriptionPlan = require("../models/subscription_plans");

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const getAllSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({}).sort({ sort_order: 1 });

    return res.status(200).json({
      message: "Subscription plans retrieved successfully",
      data: plans,
      total: plans.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getActiveSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ is_active: true }).sort({
      sort_order: 1,
    });

    return res.status(200).json({
      message: "Active subscription plans retrieved successfully",
      data: plans,
      total: plans.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getSubscriptionPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await SubscriptionPlan.findById(id);

    if (!plan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    return res.status(200).json({
      message: "Subscription plan retrieved successfully",
      data: plan,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getSubscriptionPlanBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const plan = await SubscriptionPlan.findOne({ slug });

    if (!plan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    return res.status(200).json({
      message: "Subscription plan retrieved successfully",
      data: plan,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const createSubscriptionPlan = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      currency,
      duration_days,
      max_screens,
      max_downloads,
      video_quality,
      has_ads,
      is_active,
      sort_order,
    } = req.body;

    if (!name || price === undefined || !currency || !duration_days) {
      return res.status(400).json({
        message: "name, price, currency and duration_days are required",
      });
    }

    if (price < 0) {
      return res.status(400).json({ message: "Price cannot be negative" });
    }

    if (duration_days <= 0) {
      return res.status(400).json({
        message: "duration_days must be greater than 0",
      });
    }

    const generatedSlug = slug || generateSlug(name);

    const existingPlan = await SubscriptionPlan.findOne({
      $or: [{ name }, { slug: generatedSlug }],
    });

    if (existingPlan) {
      return res.status(409).json({
        message: "Subscription plan with the same name or slug already exists",
      });
    }

    const newPlan = new SubscriptionPlan({
      name,
      slug: generatedSlug,
      description: description || "",
      price,
      currency,
      duration_days,
      max_screens: max_screens !== undefined ? max_screens : false,
      max_downloads: max_downloads || 0,
      video_quality: video_quality || "HD",
      has_ads: has_ads !== undefined ? has_ads : false,
      is_active: is_active !== undefined ? is_active : true,
      sort_order: sort_order || 0,
    });

    await newPlan.save();

    return res.status(201).json({
      message: "Subscription plan created successfully",
      data: newPlan,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updateSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Subscription plan ID is required" });
    }

    const plan = await SubscriptionPlan.findById(id);

    if (!plan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    const {
      name,
      slug,
      description,
      price,
      currency,
      duration_days,
      max_screens,
      max_downloads,
      video_quality,
      has_ads,
      is_active,
      sort_order,
    } = req.body;

    if (name) {
      plan.name = name;
      plan.slug = slug || generateSlug(name);
    } else if (slug) {
      plan.slug = slug;
    }

    if (plan.slug !== (await SubscriptionPlan.findById(id)).slug) {
      const existingSlug = await SubscriptionPlan.findOne({
        slug: plan.slug,
        _id: { $ne: id },
      });
      if (existingSlug) {
        return res.status(409).json({ message: "Slug already exists" });
      }
    }

    if (description !== undefined) plan.description = description;
    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({ message: "Price cannot be negative" });
      }
      plan.price = price;
    }
    if (currency) plan.currency = currency;
    if (duration_days !== undefined) {
      if (duration_days <= 0) {
        return res.status(400).json({
          message: "duration_days must be greater than 0",
        });
      }
      plan.duration_days = duration_days;
    }
    if (max_screens !== undefined) plan.max_screens = max_screens;
    if (max_downloads !== undefined) plan.max_downloads = max_downloads;
    if (video_quality) {
      if (!["SD", "HD", "FHD", "4K"].includes(video_quality)) {
        return res.status(400).json({
          message: "Invalid video_quality. Must be: SD, HD, FHD, or 4K",
        });
      }
      plan.video_quality = video_quality;
    }
    if (has_ads !== undefined) plan.has_ads = has_ads;
    if (is_active !== undefined) plan.is_active = is_active;
    if (sort_order !== undefined) plan.sort_order = sort_order;

    await plan.save();

    return res.status(200).json({
      message: "Subscription plan updated successfully",
      data: plan,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Subscription plan ID is required" });
    }

    const deletedPlan = await SubscriptionPlan.findByIdAndDelete(id);

    if (!deletedPlan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    return res.status(200).json({
      message: "Subscription plan deleted successfully",
      data: deletedPlan,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getAllSubscriptionPlans,
  getActiveSubscriptionPlans,
  getSubscriptionPlanById,
  getSubscriptionPlanBySlug,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
};
